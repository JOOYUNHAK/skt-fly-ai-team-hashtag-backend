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
import { UploadVideoCompleteEventHandler } from "./event/upload-video-complete-event.handler";
import { CommunicationErrorAiEventHandler } from "./event/communication-error-ai-event.handler";
import { S3Module } from "src/aws/s3/s3.module";
import { SaveSSEInstanceCommandHandler } from "./command/save-sse-instance-command.handler";
import { UploadFileToS3CommandHandler } from "./command/upload-file-to-s3-command.handler";
import { SummaryContentSaveCompleteEventHandler } from "./event/summary-content-save-complete-event.handler";
import { LoadFileByFsQueryHandler } from "./query/load-file-by-fs-query.handler";
import { SummaryCompleteEventHandler } from "./application/event-handler/summary-complete-event.handler";
import { SummaryFailEventHandler } from "./event/summary-fail-event.handler";
import { AutomapperModule } from "@automapper/nestjs";
import { classes } from "@automapper/classes";
import { VideoService } from "./application/video.service";
import { VideoRepository } from "./infra/video.repository";
import { VideoProfile } from "./interface/mapper/video.profile";

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
        HttpModule
    ],
    controllers: [VideoController],
    providers: [
        VideoProfile,
        GetVideoDetailQueryHandler,
        GetThumbNailPathQueryHandler,
        GetVideoListQueryHandler,
        SaveAiResponseCommandHandler,
        UploadCompleteVideoCommandHandler,
        GetTempVideoDataQueryHandler,
        NotUploadVideoCommandHandler,
        UploadVideoCompleteEventHandler,
        CommunicationErrorAiEventHandler,
        SaveSSEInstanceCommandHandler,
        UploadFileToS3CommandHandler,
        SummaryContentSaveCompleteEventHandler,
        LoadFileByFsQueryHandler,
        SummaryCompleteEventHandler,
        SummaryFailEventHandler,
        VideoService,
        VideoRepository,
    ]
})
export class VideoModule {}