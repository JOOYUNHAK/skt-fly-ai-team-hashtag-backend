import { Controller, Post, UploadedFiles, UseInterceptors, Get, Body, Param } from "@nestjs/common"; 4
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import { UploadFilesCommand } from "./command/upload-files.command";
import { GetThumbNailPathResponseDto, GetVideoListResponseDto } from "./dto/response/video-request-response.dto";
import { GetThumbNailPathQuery } from "./query/get-thumb-nail-path.query";
import { GetVideoListQuery } from "./query/get-video-list.query";
import { GetVideoPathQuery } from "./query/get-video-path.query";

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
    async getThumbNailPaths(@Param('id') userId: string):Promise<GetThumbNailPathResponseDto> {
        const data = await this.queryBus.execute( new GetThumbNailPathQuery(userId) );
        return {
            statusCode: 200,
            message: 'OK',
            body: {
                ...data
            }
        };
    }

    @Get(':videoId')
    async streamingVideo(@Param('videoId') videoId: string): Promise<any> {
        const videoPath = await this.queryBus.execute(new GetVideoPathQuery(videoId));
        return {
            statusCode: 200,
            message: 'OK',
            body: {
                ...videoPath
            }
        }
    }
}