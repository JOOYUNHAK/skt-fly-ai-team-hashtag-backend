import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { DatabaseModule } from "src/database/database.module";
import { GetVideoListQueryHandler } from "./query/get-video-list-query.handler";
import { GetVideoDetailQueryHandler } from "./query/get-video-detail-query.handler";
import { VideoController } from "./interface/video.controller";
import { RedisModule } from "../redis/redis.module";
import { HttpModule } from "@nestjs/axios";
import { VideoService } from "./application/video.service";
import { VideoRepository } from "./infra/database/video.repository";
import { VideoProfile } from "./interface/mapper/video.profile";
import { NotificationModule } from "src/notification/notification.module";
import { GetThumbNailPathQueryHandler } from "./query/get-thumb-nail-path-query.handler";
import { S3Module } from "src/s3/s3.module";
import { MediaRepository } from "./infra/adapter/media.repository";
import { SummarizationRepository } from "./infra/database/summarization.repository";
import { NotUploadedVideoEventHandler } from "./application/event/handler/not-upload-video";
import { SummarizationCompletedEventHandler } from "./application/event/handler/summarization-completed";

@Module({
    imports: [
        CqrsModule,
        S3Module,
        DatabaseModule,
        RedisModule,
        HttpModule,
        NotificationModule
    ],
    controllers: [VideoController],
    providers: [
        VideoProfile,
        GetVideoDetailQueryHandler,
        GetVideoListQueryHandler,
        GetThumbNailPathQueryHandler,
        VideoService,
        VideoRepository,
        MediaRepository,
        SummarizationRepository,
        SummarizationCompletedEventHandler,
        NotUploadedVideoEventHandler
    ]
})
export class VideoModule {}