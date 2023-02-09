import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { CqrsModule } from "@nestjs/cqrs";
import { MulterModule } from "@nestjs/platform-express";
import { DatabaseModule } from "src/database/database.module";
import { multerOptionsFactory } from "src/multer/multer-options.factory";
import { UploadFilesCommandHandler } from "./command/upload-files-command.handler";
import { GetVideoListQueryHandler } from "./query/get-video-list-query.handler";
import { GetVideoDetailQueryHandler } from "./query/get-video-detail-query.handler";
import { VideoController } from "./video.controller";
import { RedisModule } from "../redis/redis.module";
import { SaveVideoPathCommandHandler } from "./command/save-video-path-command.handler";
import { GetThumbNailPathQueryHandler } from "./query/get-thumb-nail-path-query.handler";
import { HttpModule } from "@nestjs/axios";

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
        UploadFilesCommandHandler,
        GetVideoDetailQueryHandler,
        GetThumbNailPathQueryHandler,
        GetVideoListQueryHandler,
        SaveVideoPathCommandHandler
    ]
})
export class VideoModule {}