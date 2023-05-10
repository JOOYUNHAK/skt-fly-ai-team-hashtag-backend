import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { GetVideoListQueryHandler } from "./application/query/get-video-list-query.handler";
import { GetVideoDetailQueryHandler } from "./application/query/get-video-detail-query.handler";
import { VideoController } from "./interface/video.controller";
import { RedisModule } from "../redis/redis.module";
import { HttpModule } from "@nestjs/axios";
import { VideoService } from "./application/video.service";
import { VideoRepository } from "./infra/database/video.repository";
import { VideoProfile } from "./interface/mapper/video.profile";
import { NotificationModule } from "src/notification/notification.module";
import { S3Module } from "src/s3/s3.module";
import { MediaRepository } from "./infra/adapter/media.repository";
import { SummarizationRepository } from "./infra/database/summarization.repository";
import { NotUploadedVideoEventHandler } from "./application/event/handler/not-upload-video";
import { SummarizationCompletedEventHandler } from "./application/event/handler/summarization-completed";
import { MongodbModule } from "src/mongodb/mongodb.module";

@Module({
    imports: [
        CqrsModule,
        S3Module,
        MongodbModule,
        RedisModule,
        HttpModule,
        NotificationModule
    ],
    controllers: [VideoController],
    providers: [
        VideoProfile,
        GetVideoDetailQueryHandler,
        GetVideoListQueryHandler,
        VideoService,
        VideoRepository,
        MediaRepository,
        SummarizationRepository,
        SummarizationCompletedEventHandler,
        NotUploadedVideoEventHandler
    ]
})
export class VideoModule {}