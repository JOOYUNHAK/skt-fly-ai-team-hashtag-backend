import { Controller, Post, Get, Body, Param, Req, Res } from "@nestjs/common";
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
import { ArriveCompleteEvent } from "./event/arrive-complete.event";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import * as fs from 'fs';
import { ConfigService } from "@nestjs/config";
import path from "path";
import { SaveAiResponseCommand } from "./command/save-ai-response.command";
import { UploadCompleteVideoCommand } from "./command/upload-complete-video.command";


@Controller('video')
export class VideoController {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus,
        private readonly httpService: HttpService,
        private readonly eventBus: EventBus,
        private readonly configService: ConfigService,
        private eventEmitter: EventEmitter2
    ) { }
    private videoHash: Object = {};
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
        return {
            statusCode: 200,
            message: 'OK',
            body: {
                detail: { ...videoInfo }
            }
        }
    }

    /* 요약 영상 원하는 비디오 경로 저장 */
    @Post('path')
    async saveVideoPath(@Body() saveVideoPathDto: SaveVideoPathDto,) {
        const { userId, videoPath } = saveVideoPathDto;
        await this.commandBus.execute(new SaveVideoPathCommand(userId, videoPath));
        this.httpService
            .axiosRef
            .post(`http://localhost:5000/video_summary`, { user_id: userId, video_origin_src: videoPath })
            .then((res) => {
                console.log('response arrive from ai Team...');
                const { data: responseData } = res;
                /* 영상 요약 완료되면 이벤트 전달 */
                this.eventEmitter.emit('complete', { data: responseData });
            })
            .catch((err) => {
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
        const {
            user_ID: userId,
            video_image: thumbNailPath,
            video_path: videoPath,
            video_tag: videoTag
        } = data;

        /* 해당 user의 http 연결 객체 */
        const sse = this.videoHash[userId];

        /* modify 2/11 */
        /* s3 client create */
        const s3Client = new S3Client({
            region: this.configService.get('AWS-S3-REGION'),
            credentials: {
                accessKeyId: this.configService.get('AWS.S3.ACCESS_KEY_ID'),
                secretAccessKey: this.configService.get('AWS.S3.SECRET_ACCESS_KEY')
            }
        });
        /* 저장된 경로에서 파일들 읽기 */
        let videoStream, thumbNailStream;
        try {
            [videoStream, thumbNailStream] = await Promise.all([
                fs.createReadStream(videoPath),
                fs.createReadStream(thumbNailPath)
            ]);
        }
        catch (err) {
            console.log('createReadStream error...', err);
        };

        const BUCKET = this.configService.get('AWS.S3.BUCKET');
        const uploadImageParams = {
            Bucket: BUCKET,
            Key: 'image/' + path.basename(thumbNailPath),
            Body: thumbNailStream
        };
        const uploadVideoParams = {
            Bucket: BUCKET,
            Key: 'video/' + path.basename(videoPath),
            Body: videoStream
        };
        /* s3에 upload */
        try {
            const [videoUploadResult, thumbNailUploadResult] = await Promise.all([
                s3Client.send(new PutObjectCommand(uploadVideoParams)),
                s3Client.send(new PutObjectCommand(uploadImageParams))
            ]);
        } catch (err) {
            console.log('error in aws return...', err);
        }
        
        /* @todo s3 return 값 받아서 클라이언트한테 전달해주기 */
        const returnData = {
            userId,
            thumbNailPath: "https://test-videodot-bucket.s3.ap-northeast-2.amazonaws.com/images/297F9E27-4B9C-4EF1-8443-DEF1132E5496.jpg",
            videoPath: 'https://test-videodot-bucket.s3.ap-northeast-2.amazonaws.com/videos/_talkv_wsKH0WhT1I_bfTKAHhz8Wb0HZ7Kc4KKk1_talkv_high.mp4',
            videoTag
        };
        await this.commandBus.execute(new SaveAiResponseCommand(userId, thumbNailPath, videoPath, videoTag));
        sse.push(returnData); // event to client

        delete this.videoHash[userId]; // 해당 user의 연결 삭제
    }

    /* 요약된 영상 전체 업로드 */
    @Post()
    async uploadVideo(@Body() uploadVideoDto: UploadVideoDto) {
        const { userId, title } = uploadVideoDto;
        await this.commandBus.execute(new UploadCompleteVideoCommand(userId, title));
    }
}
