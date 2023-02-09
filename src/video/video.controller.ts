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


@Controller('video')
export class VideoController {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus,
        private readonly httpService: HttpService,
        private readonly eventBus: EventBus,
        private eventEmitter: EventEmitter2
    ) { }
    private videoHash:Object = {};
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
            .post(`http://localhost:5000/video_summary`, { userId, videoPath })
            .then((res) => {
                console.log('response arrive from ai Team...');
                const { data: responseData } = res;
                /* 영상 요약 완료되면 이벤트 전달 */
                this.eventEmitter.emit('complete', { data: JSON.stringify(responseData) });
            })
            .catch((err) => {
                console.log('ai 팀과 통신하지 못했어요...', err);
            })
    }

    @Get('sse')
    @OnEvent('complete')
    async sentEventToClient( payload?: string, @Req() req?: Request, @Res() res?: Response ) {
        const { data } = JSON.parse(payload);
        const { 
            user_ID: userId, 
            video_image: videoImage, 
            video_path: videoPath, 
            video_tag: videoTag 
        } = data;
        if( this.videoHash[userId] ) {
            const sse = this.videoHash[userId];
            sse.push('complete');
            await this.eventBus.publish(new ArriveCompleteEvent(userId, videoImage, videoPath, videoTag));
            delete this.videoHash[userId];
            return;
        }
        const sse = await createSession(req, res);
        this.videoHash[userId] = sse;
    }

    /* 요약된 영상 업로드 */
    @Post()
    async uploadVideo(@Body() uploadVideoDto: UploadVideoDto) {
        const { userId, title } = uploadVideoDto;
        let tempVideoData = await this.queryBus.execute(new GetTempVideoDataQuery(userId));
        tempVideoData['title'] = title; //원래의 data에 video의 title 추가
        /**
         * @todo redis에 저장하는 logic -> 이후 이벤트 발생하여 기존 temp 데이터 삭제 logic
         */
    }
}
