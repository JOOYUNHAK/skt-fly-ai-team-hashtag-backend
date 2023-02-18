import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { CqrsModule } from "@nestjs/cqrs";
import { MulterModule } from "@nestjs/platform-express";
import { DatabaseModule } from "src/database/database.module";
import { multerOptionsFactory } from "src/multer/multer-options.factory";
import { GetVideoListQueryHandler } from "./query/get-video-list-query.handler";
import { GetVideoDetailQueryHandler } from "./query/get-video-detail-query.handler";
import { VideoController } from "./video.controller";
import { RedisModule } from "../redis/redis.module";
import { SaveVideoPathCommandHandler } from "./command/save-video-path-command.handler";
import { GetThumbNailPathQueryHandler } from "./query/get-thumb-nail-path-query.handler";
import { HttpModule } from "@nestjs/axios";
import { SaveAiResponseCommandHandler } from "./command/save-ai-response-command.handler";
import { UploadCompleteVideoCommandHandler } from "./command/upload-complete-video-command.handler";
import { GetTempVideoDataQueryHandler } from "./query/get-temp-video-data-query.handler";
import { NotUploadVideoCommandHandler } from "./command/not-upload-video-command.handler";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { UploadVideoCompleteEventHandler } from "./event/upload-video-complete-event.handler";
import { CommunicationErrorAiEventHandler } from "./event/communication-error-ai-event.handler";
import { S3Module } from "src/aws/s3/s3.module";

@Module({
    imports: [
        CqrsModule,
        DatabaseModule,
        RedisModule,
        S3Module,
        MulterModule.registerAsync({
            imports: [ConfigModule],
            useFactory: multerOptionsFactory,
            inject: [ConfigService]
        }),
        EventEmitterModule.forRoot(),
        HttpModule
    ],
    controllers: [VideoController],
    providers: [
        GetVideoDetailQueryHandler,
        GetThumbNailPathQueryHandler,
        GetVideoListQueryHandler,
        SaveVideoPathCommandHandler,
        SaveAiResponseCommandHandler,
        UploadCompleteVideoCommandHandler,
        GetTempVideoDataQueryHandler,
        NotUploadVideoCommandHandler,
        UploadVideoCompleteEventHandler,
        CommunicationErrorAiEventHandler,
    ]
})
export class VideoModule {}