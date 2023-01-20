import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { DatabaseModule } from "src/database/database.module";
import { UploadFilesCommandHandler } from "./command/upload-files-command.handler";
import { GetStreamingDataQueryHandler } from "./query/get-streaming-data-query.handler.ts";
import { GetVideoPathQueryHandler } from "./query/get-video-path-query.handler";
import { GetVideoPathQuery } from "./query/get-video-path.query";
import { VideoController } from "./video.controller";

@Module({
    imports: [
        CqrsModule,
        DatabaseModule
    ],
    controllers: [VideoController],
    providers: [
        UploadFilesCommandHandler,
        GetVideoPathQueryHandler,
        GetStreamingDataQueryHandler
    ]
})
export class VideoModule {}