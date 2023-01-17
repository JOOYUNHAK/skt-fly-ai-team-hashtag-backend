import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { DatabaseModule } from "src/database/database.module";
import { UploadFilesCommandHandler } from "./command/upload-files-command.handler";
import { GetStreamingPathQueryHandler } from "./query/get-streaming-path-query.handler";
import { VideoController } from "./video.controller";

@Module({
    imports: [
        CqrsModule,
        DatabaseModule
    ],
    controllers: [VideoController],
    providers: [
        UploadFilesCommandHandler,
        GetStreamingPathQueryHandler
    ]
})
export class VideoModule {}