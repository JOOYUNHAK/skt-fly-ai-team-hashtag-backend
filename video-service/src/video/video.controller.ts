import { Controller, Post, Get, Body, Param, Req, Res, Put } from "@nestjs/common";
import { CommandBus, EventBus, QueryBus } from "@nestjs/cqrs";
import { GetVideoListResponseDto } from "./dto/response/video-request-response.dto";
import { GetThumbNailPathQuery } from "./query/get-thumb-nail-path.query";
import { GetVideoListQuery } from "./query/get-video-list.query";
import { GetVideoDetailQuery } from "./query/get-video-detail.query";
import { SaveVideoPathDto } from "./dto/save-video-path.dto";
import { SaveVideoPathCommand } from "./command/save-video-path.command";
import { UploadVideoDto } from "./dto/upload-video.dto";
import { HttpService } from "@nestjs/axios";
import { EventEmitter2, OnEvent } from "@nestjs/event-emitter";
import { Request, Response } from "express";
import { createSession } from "better-sse";
import { ConfigService } from "@nestjs/config";
import { SaveAiResponseCommand } from "./command/save-ai-response.command";
import { UploadCompleteVideoCommand } from "./command/upload-complete-video.command";
import { NotUploadVideoCommand } from "./command/not-upload-video.command";
import { CommunicationErrorAiEvent } from "./event/communication-error-ai.event";
import { UploadFileToS3Command } from "./command/upload-file-to-s3.command";
import { GetBeforeSummaryVideoPathQuery } from "./query/get-before-summary-video-path-query";
import { SaveSSEInstanceCommand } from "./command/save-sse-instance.command";
import { LoadFileByFsQuery } from "./query/load-file-by-fs.query";


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
            .post(`${this.configService.get('url.ai')}/video_summary`, { user_id: userId, nickname: nickName, video_origin_src: videoPath, category: label  })
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
            const sse = await createSession(req, res);
            await this.commandBus.execute(new SaveSSEInstanceCommand(req.body.userId, sse));
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

        /* AI 팀이 요약한 영상과 이미지 저장 경로로부터 가져오고 S3에 업로드*/
        const [ videoStream, thumbNailStream ] = await this.queryBus.execute(new LoadFileByFsQuery( videoPath, thumbNailPath ));
        await this.commandBus.execute(new UploadFileToS3Command(videoPath, thumbNailPath, videoStream, thumbNailStream));

        /* S3에 업로드 하고 난 이후 사용자가 영상을 보고 저장을 하지 
            않을수도 있으므로 요약 전 영상 경로와 함께 요약된 정보 저장 */
        const beforeSummaryVideoPath = await this.queryBus.execute(new GetBeforeSummaryVideoPathQuery(userId)); 
        await this.commandBus.execute(new SaveAiResponseCommand(userId, nickName, videoPath, thumbNailPath, tags, category, beforeSummaryVideoPath))
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
        await this.commandBus.execute(new NotUploadVideoCommand(userId));
    }
}
