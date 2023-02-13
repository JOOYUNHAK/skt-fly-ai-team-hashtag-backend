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
import { S3Provider } from "./provider/s3.provider";
import { SaveAiResponseCommandHandler } from "./command/save-ai-response-command.handler";
import { UploadCompleteVideoCommandHandler } from "./command/upload-complete-video-command.handler";
import { GetTempVideoDataQueryHandler } from "./query/get-temp-video-data-query.handler";
import { NotUploadVideoCommandHandler } from "./command/not-upload-video-command.handler";

@Module({
    imports: [
        CqrsModule,
        DatabaseModule,
        RedisModule,
        MulterModule.registerAsync({
            imports: [ConfigModule],
            useFactory: multerOptionsFactory,
            inject: [ConfigService]
        }),
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
        ...S3Provider
    ]
})
export class VideoModule {}