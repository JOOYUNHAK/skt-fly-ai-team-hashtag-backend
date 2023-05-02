import { Controller, Post, Get, Body, Param, Req, Res, Put } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { GetVideoListResponseDto } from "./interface/dto/response/video-request-response.dto";
import { GetThumbNailPathQuery } from "./query/get-thumb-nail-path.query";
import { GetVideoListQuery } from "./query/get-video-list.query";
import { GetVideoDetailQuery } from "./query/get-video-detail.query";
import { UploadVideoDto } from "./interface/dto/upload-video.dto";
import { Request, Response } from "express";
import { createSession } from "better-sse";
import { UploadCompleteVideoCommand } from "./command/upload-complete-video.command";
import { NotUploadVideoCommand } from "./command/not-upload-video.command";
import { SaveSSEInstanceCommand } from "./command/save-sse-instance.command";
import { StartSummaryDto } from "./interface/dto/start-summary.dto";
import { MapPipe } from "@automapper/nestjs";
import { VideoMetaInfo } from "./domain/video/video-meta-info";
import { VideoService } from "./application/video.service";
import { CompleteSummaryDto } from "./interface/dto/complete-summary.dto";
import { VideoSummaryInfo } from "./domain/video/video-summary-info";

@Controller('video')
export class VideoController {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus,
        private readonly videoService: VideoService,
    ) { }

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

    /* 해당 경로로 요청이 들어오면 클라이언트에서 
        영상을 저장하고 AI 팀에게 영상 정보를 전송 완료함 */
    @Post('summary')
    async startVideoSummary(@Body(MapPipe(StartSummaryDto, VideoMetaInfo)) videoMetaInfo: VideoMetaInfo): Promise<void> {
        await this.videoService.startVideoSummary(videoMetaInfo);
    }

    /* Ai 팀으로부터 오는 요약 정보를 업데이트 */
    @Put('summary')
    async completeVideoSummary(@Body(MapPipe(CompleteSummaryDto, VideoSummaryInfo)) videoSummaryInfo: VideoSummaryInfo): Promise<void> {
        await this.videoService.completeVideoSummary(videoSummaryInfo);
    }

    @Post('sse')
    async sentEventToClient(@Req() req?: Request, @Res() res?: Response) {
        const sse = await createSession(req, res);
        await this.commandBus.execute(new SaveSSEInstanceCommand(req.body.userId, sse));
        return;
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
