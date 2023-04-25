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
import { Request, Response } from "express";
import { createSession } from "better-sse";
import { ConfigService } from "@nestjs/config";
import { UploadCompleteVideoCommand } from "./command/upload-complete-video.command";
import { NotUploadVideoCommand } from "./command/not-upload-video.command";
import { SaveSSEInstanceCommand } from "./command/save-sse-instance.command";
import { SummaryCompleteEvent } from "./event/summary-complete.event";
import { SummaryFailEvent } from "./event/summary-fail-event";


@Controller('video')
export class VideoController {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus,
        private readonly httpService: HttpService,
        private readonly eventBus: EventBus,
        private readonly configService: ConfigService,
    ) { }
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
        category.map((eachCategory) => label.push(this.categoryLabel.indexOf(eachCategory)));
        this.httpService
            .axiosRef
            .post(`${this.configService.get('url.ai')}/video_summary`, { user_id: userId, nickname: nickName, video_origin_src: videoPath, category: label })
            .then((res) => {
                const { data } = res;
                /* 영상 요약 완료되면 완료 이벤트 전달 */
                this.eventBus.publish(new SummaryCompleteEvent(
                    data.user_ID, data.nickname, data.video_image,
                    data.video_path, data.video_tag, category
                ))
            })
            .catch((err) => {
                this.eventBus.publish(new SummaryFailEvent(userId));
            })
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
