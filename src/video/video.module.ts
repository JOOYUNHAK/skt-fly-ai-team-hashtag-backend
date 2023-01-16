import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { MongooseModule } from "@nestjs/mongoose";
import { UploadFilesCommandHandler } from "./command/upload-files-command.handler";
import { VideoSchema } from "./schemas/video.schema";
import { VideoController } from "./video.controller";

@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'videos', schema: VideoSchema }]),
        CqrsModule
    ],
    controllers: [VideoController],
    providers: [UploadFilesCommandHandler]
})
export class VideoModule {}