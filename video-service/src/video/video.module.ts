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
import { MongodbModule } from "src/mongodb/mongodb.module";
import { CommentRepository } from "./infra/database/comment.repository";
import { CommentedToVideoEventHandler } from "./application/event/handler/commented-video";
import { LikeRepository } from "./infra/database/like.repository";
import { VideoLikeUpdatedEventHandler } from "./application/event/handler/video-like-updated";
import { SummarizationProvider } from "./infra/database/summarization/summarization.provider";
import { MysqlModule } from "src/mysql/mysql.module";
import { UploadedSummarizationVideoEventHandler } from "./application/event/handler/uploaded-summarization-video";

@Module({
    imports: [
        CqrsModule,
        MysqlModule,
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
        NotUploadedVideoEventHandler,
        CommentRepository,
        CommentedToVideoEventHandler,
        LikeRepository,
        VideoLikeUpdatedEventHandler,
        ...SummarizationProvider,
        UploadedSummarizationVideoEventHandler
    ]
})
export class VideoModule {}