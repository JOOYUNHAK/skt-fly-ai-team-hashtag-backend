import { Controller, Post, UploadedFiles, UseInterceptors, Get, Body, Param, Header, Res, Req } from "@nestjs/common"; 4
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import { Response, Request } from "express";
import * as fs from 'fs';

import { storage } from "../multer/multer-option-storage";
import { UploadFilesCommand } from "./command/upload-files.command";
import { UploadFilesDto } from "./dto/upload-files.dto";
import { GetVideoPathQuery } from "./query/get-video-path.query";

@Controller('video')
export class VideoController {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus
    ) { }
    @Post()
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'video', maxCount: 1 },
        { name: 'image', maxCount: 1 }
    ], { storage }))
    async upload(
        @UploadedFiles() files: Express.Multer.File[],
        @Body() uploadFilesDto: UploadFilesDto
    ) {
        const { video, image } = JSON.parse(JSON.stringify(files));
        const { userId: owner } = uploadFilesDto;
        await this.commandBus.execute(new UploadFilesCommand(owner, video[0].path, image[0].path))
    }

    @Get(':videoId')
    async streamingVideo(@Req() request: Request, @Res() response: Response, @Param('videoId') videoId: string) {
        const videoDataRange = request.headers.range;
        const { videoPath } = await this.queryBus.execute(new GetVideoPathQuery(videoId));
        const videoSize = fs.statSync(videoPath).size;
        if (videoDataRange) {
            const range = videoDataRange.replace(/bytes=/, '').split('-');
            const start = parseInt(range[0]);
            const end = parseInt(range[1]);
            const chunk = end - start + 1;

            const file = fs.createReadStream(videoPath, { start, end });
            const head = {
                'Content-Range': `bytes ${start}-${end}/${videoSize}`,
                'Accept-Ranges': 'bytes',
                'Content-Length': chunk,
                'Content-Type': 'video/mp4',
            };
            response.writeHead(206, head);
            file.pipe(response);
        } else {
            const head = {
                'Content-Length': videoSize,
                'Content-Type': 'video/mp4',
            };
            response.writeHead(200, head);
            fs.createReadStream(videoPath).pipe(response)
        }
    }

    @Get()
    async getVideoList() {

    }

}