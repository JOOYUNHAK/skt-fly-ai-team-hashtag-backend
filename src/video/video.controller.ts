import { Controller, Post, UploadedFiles, UseInterceptors, Get, Body, Param } from "@nestjs/common"; 4
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import { UploadFilesCommand } from "./command/upload-files.command";
import { GetThumbNailPathResponseDto, GetVideoListResponseDto } from "./dto/response/video-request-response.dto";
import { GetThumbNailPathQuery } from "./query/get-thumb-nail-path.query";
import { GetVideoListQuery } from "./query/get-video-list.query";
import { GetVideoDetailQuery } from "./query/get-video-detail.query";
import { SaveVideoPathDto } from "./dto/save-video-path.dto";
import { SaveVideoPathCommand } from "./command/save-video-path.command";

@Controller('video')
export class VideoController {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus
    ) { }

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
    async getThumbNailPaths(@Param('id') userId: string):Promise<Document []> {
        return await this.queryBus.execute( new GetThumbNailPathQuery(userId) );
    }

    @Get('detail/:videoId')
    async streamingVideo(@Param('videoId') videoId: string): Promise<any> {
        const videoInfo = await this.queryBus.execute(new GetVideoDetailQuery(videoId));
        return {
            statusCode: 200,
            message: 'OK',
            body: {
                ...videoInfo
            }
        }
    }

    /* 요약 영상 원하는 비디오 경로 저장 */
    @Post('path')
    async saveThumbNailPath(@Body() videoPathDto: SaveVideoPathDto) {
        const { userId, videoPath } = videoPathDto;
        await this.commandBus.execute(new SaveVideoPathCommand(userId, videoPath));
    }
}