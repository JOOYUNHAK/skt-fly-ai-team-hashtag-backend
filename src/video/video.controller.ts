import { Controller, Post, UploadedFiles, UseInterceptors, ParseFilePipeBuilder, HttpStatus, Get, Body } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import { storage } from "../multer/multer-option-storage";
import { UploadFilesCommand } from "./command/upload-files.command";
import { UploadFilesDto } from "./dto/uploadFiles.dto";

@Controller('video')
export class VideoController {
    constructor(
        private readonly commandBus: CommandBus
    ) {}
    @Post()
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'video', maxCount: 1 },
        { name: 'image', maxCount: 1 }
    ], { storage }))
    async upload(
        @UploadedFiles() files: Express.Multer.File[], 
        @Body() uploadFilesDto: UploadFilesDto
        ) {
        const { video, image } = JSON.parse( JSON.stringify(files) );
        const { userId: owner } = uploadFilesDto;
        await this.commandBus.execute(new UploadFilesCommand(owner, video[0].path, image[0].path))
    }

    @Get()
    async streamingVideo() {

    }

    @Get()
    async getVideoList() {

    }

}