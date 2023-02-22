import { Controller, Post, Get, Body, Param, Req, Res, Put } from "@nestjs/common";
import { CommandBus, EventBus, QueryBus } from "@nestjs/cqrs";
import { GetVideoListResponseDto } from "./dto/response/video-request-response.dto";
import { GetThumbNailPathQuery } from "./query/get-thumb-nail-path.query";
import { GetVideoListQuery } from "./query/get-video-list.query";
import { GetVideoDetailQuery } from "./query/get-video-detail.query";
import { SaveVideoPathDto } from "./dto/save-video-path.dto";
import { SaveVideoPathCommand } from "./command/save-video-path.command";
import { UploadVideoDto } from "./dto/upload-video.dto";
import { GetTempVideoDataQuery } from "./query/get-temp-video-data.query";
import { HttpService } from "@nestjs/axios";
import { EventEmitter2, OnEvent } from "@nestjs/event-emitter";
import { Request, Response } from "express";
import { createSession } from "better-sse";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import * as fs from 'fs';
import { ConfigService } from "@nestjs/config";
import * as path from "path";
import { SaveAiResponseCommand } from "./command/save-ai-response.command";
import { UploadCompleteVideoCommand } from "./command/upload-complete-video.command";
import { NotUploadVideoCommand } from "./command/not-upload-video.command";
import { CommunicationErrorAiEvent } from "./event/communication-error-ai.event";


@Controller('video')
export class VideoController {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus,
        private readonly httpService: HttpService,
        private readonly eventBus: EventBus,
        private readonly configService: ConfigService,
        private eventEmitter: EventEmitter2,
    ) { }
    private videoHash: Object = {};
    private readonly categoryLabel = ['가족', '스터디', '뷰티', '반려동물', '운동/스포츠', '음식', '여행', '연애/결혼', '문화생활', '직장인'];
    /* @Post()
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'video', maxCount: 1 },
        { name: 'image', maxCount: 1 }
    ]))
    async upload(
        @UploadedFiles() files: Express.MulterS3.File[],
        @Body() uploadFilesDto: UploadFilesDto
    ) {
        const { video, image } = JSON.parse(JSON.stringify(files));
        const { userId: owner } = uploadFilesDto;
        await this.commandBus.execute(
            new UploadFilesCommand(owner, video[0].location, image[0].location)
        );
    } */

    /* main page loading시 최신 비디오, 인기 비디오 로딩 */
    @Get('list')
    async getVideoList(): Promise<GetVideoListResponseDto> {
        const data = await this.queryBus.execute(new GetVideoListQuery());
        return {
            statusCode: 200,
            message: 'OK',
            body: {
                ...data
            }
        }
    }

    /* 사용자 MyFeed 조회 */
    @Get(`image/:id`)
    async getThumbNailPaths(@Param('id') userId: string): Promise<Document[]> {
        return await this.queryBus.execute(new GetThumbNailPathQuery(userId));
    }

    @Get('detail/:videoId')
    async getVideoDetail(@Param('videoId') videoId: string): Promise<any> {
        const [videoInfo] = await this.queryBus.execute(new GetVideoDetailQuery(videoId));
        return videoInfo;
    }

    /* 요약 영상 원하는 비디오 경로 저장 */
    @Post('path')
    async saveVideoPath(@Body() saveVideoPathDto: SaveVideoPathDto,) {
        const label = [];
        const { userId, nickName, videoPath, category } = saveVideoPathDto;
        await this.commandBus.execute(new SaveVideoPathCommand(userId, videoPath));
        category.map((eachCategory) => label.push( this.categoryLabel.indexOf(eachCategory) ));
        this.httpService
            .axiosRef
            .post(`http://localhost:5000/video_summary`, { user_id: userId, nickname: nickName, video_origin_src: videoPath, category: label  })
            .then((res) => {
                console.log('response arrive from ai Team...');
                const { data: responseData } = res;
                /* 영상 요약 완료되면 이벤트 전달 */
                this.eventEmitter.emit('complete', { data: { ...responseData, category } }); // category 항목도 추가
            })
            .catch((err) => {
                this.eventEmitter.emit('communication_error_ai', { userId });
                console.log('ai 팀과 통신하지 못했어요...', err);
            })
    }

    @Post('sse')
    @OnEvent('complete')
    async sentEventToClient(payload?: any, @Req() req?: Request, @Res() res?: Response) {
        /* Event가 아닌 sse 연결 요청일 때 */
        if (req?.body) {
            const { userId } = req.body;
            const sse = await createSession(req, res);
            this.videoHash[userId] = sse;
            return;
        }
        /* complete Event 신호가 들어왔을 때 */
        let { data } = payload;
        let {
            user_ID: userId,
            nickname: nickName,
            video_image: thumbNailPath,
            video_path: videoPath,
            video_tag: tags,
            category
        } = data;

        /* 해당 user의 http 연결 객체 */
        const sse = this.videoHash[userId];

        /* @todo s3객체 inject, bucket 밖으로 빼기 */
        const REGION = this.configService.get('AWS.S3.REGION') // aws s3 region
        const BUCKET = this.configService.get('AWS.S3.BUCKET');// aws s3 bucket

        // s3 client 객체 생성
        const s3Client = new S3Client({
            region: REGION,
            credentials: {
                accessKeyId: this.configService.get('AWS.S3.ACCESS_KEY_ID'),
                secretAccessKey: this.configService.get('AWS.S3.SECRET_ACCESS_KEY')
            }
        });
        /* 저장된 경로에서 파일들 읽기 */
        let videoStream: fs.ReadStream, thumbNailStream: fs.ReadStream;
        try {
            [videoStream, thumbNailStream] = await Promise.all([
                fs.createReadStream(videoPath),
                fs.createReadStream(thumbNailPath)
            ]);
        }
        catch (err) {
            console.log('createReadStream error...', err);
        };

        /* s3에 올리기 위한 Key값들 */
        const thumbNailKey = 'images/' + path.basename(thumbNailPath);
        const videoKey = 'videos/' + path.basename(videoPath);

        const uploadImageParams = {
            ACL: 'public-read',
            Bucket: BUCKET,
            Key: thumbNailKey,
            Body: thumbNailStream
        };
        const uploadVideoParams = {
            ACL: 'public-read',
            Bucket: BUCKET,
            Key: videoKey,
            Body: videoStream
        };
        /* s3에 upload */
        try {
            await Promise.all([
                s3Client.send(new PutObjectCommand(uploadVideoParams)),
                s3Client.send(new PutObjectCommand(uploadImageParams))
            ]);
            
            thumbNailPath = `https://${BUCKET}.s3.${REGION}.amazonaws.com/${thumbNailKey}`;
            videoPath = `https://${BUCKET}.s3.${REGION}.amazonaws.com/${videoKey}`;
            
            await this.commandBus.execute(new SaveAiResponseCommand(userId, nickName, thumbNailPath, videoPath, tags, category));
            sse.push({ userId, thumbNailPath, videoPath, tags }); // event to client

            delete this.videoHash[userId]; // 해당 user의 연결 삭제
        } catch (err) {
            console.log('error in aws return...', err);
        }
    }
    
    /* Ai 팀과 통신 오류 났을 때 */
    @OnEvent('communication_error_ai')    
    serverErrorAiTeam( payload: { userId:string }) {
        const { userId } = payload;
        /* 해당 user의 http 연결 객체 */
        const sse = this.videoHash[userId];
        sse.push('SERVER_ERROR'); // event to client
        delete this.videoHash[userId]; // 해당 user의 연결 삭제
        /* 실패했다는 Event -> Redis temp data 삭제 */
        this.eventBus.publish(new CommunicationErrorAiEvent(userId));
    }

    /* 요약된 영상 전체 업로드 */
    @Post()
    async uploadVideo(@Body() uploadVideoDto: UploadVideoDto) {
        const { userId, title } = uploadVideoDto;
        await this.commandBus.execute(new UploadCompleteVideoCommand(userId, title));
    }

    /* 요약된 정보 업로드 하지 않았을 때 */
    @Put()
    async notUploadVideo(@Body() userId: string) {
        return;
        //await this.commandBus.execute(new NotUploadVideoCommand(userId)); // 테스트용 위해
    }
}