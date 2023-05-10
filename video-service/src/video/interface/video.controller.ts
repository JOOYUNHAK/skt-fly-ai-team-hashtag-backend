import { Controller, Post, Get, Body, Param, Put, ParseIntPipe } from "@nestjs/common";
import { QueryBus } from "@nestjs/cqrs";
import { GetVideoListQuery } from "../application/query/get-video-list.query";
import { GetVideoDetailQuery } from "../application/query/get-video-detail.query";
import { UploadVideoDto } from "./dto/summarization/upload-video.dto";
import { StartSummaryDto } from "./dto/summarization/start-summary.dto";
import { MapPipe } from "@automapper/nestjs";
import { VideoMetaInfo } from "../domain/summarization/video-meta-info";
import { VideoService } from "../application/video.service";
import { CompleteSummaryDto } from "./dto/summarization/complete-summary.dto";
import { ResultInfo } from "../domain/summarization/result-info";
import { AddCommentDto } from "./dto/comment/add-comment.dto";
import { VideoComment } from "../domain/comment/video-comment";

@Controller('video')
export class VideoController {
    constructor(
        private readonly queryBus: QueryBus,
        private readonly videoService: VideoService,
    ) { }

    /* main page loading시 최신 비디오, 인기 비디오 로딩 */
    @Get('list')
    async getVideoList(): Promise<any> {
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
    async getThumbNailPaths(@Param('id', ParseIntPipe) userId: number): Promise<string[]> {
        return await this.videoService.getThumbNailPaths(userId);
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
    async completeVideoSummary(@Body(MapPipe(CompleteSummaryDto, ResultInfo)) resultInfo: ResultInfo): Promise<void> {
        await this.videoService.completeVideoSummary(resultInfo);
    }

    /* 요약된 영상 제목과 함께 전체 업로드 */
    @Post()
    async uploadVideo(@Body() uploadVideoDto: UploadVideoDto) {
        await this.videoService.uploadVideo(uploadVideoDto.summarizationId, uploadVideoDto.title);
    }

    /* 요약된 영상 보고 난 이후 저장 하지 않을 때 */
    @Put()
    async notUploadVideo(@Body('summarizationId') id: string) {
        await this.videoService.notUploadVideo(id);
    }

    /* 영상에 대한 댓글 작성 */ 
    @Post('comment')
    async addCommentToVideo(@Body(MapPipe(AddCommentDto, VideoComment)) videoComment: VideoComment) {
        await this.videoService.addCommentToVideo(videoComment);
    }
}
