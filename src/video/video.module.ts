import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { CqrsModule } from "@nestjs/cqrs";
import { MulterModule } from "@nestjs/platform-express";
import { DatabaseModule } from "src/database/database.module";
import { multerOptionsFactory } from "src/multer/multer-options.factory";
import { UploadFilesCommandHandler } from "./command/upload-files-command.handler";
import { GetVideoListQueryHandler } from "./query/get-video-list-query.handler";
import { GetVideoPathQueryHandler } from "./query/get-video-path-query.handler";
import { VideoController } from "./video.controller";

@Module({
    imports: [
        CqrsModule,
        DatabaseModule,
        MulterModule.registerAsync({
            imports: [ConfigModule],
            useFactory: multerOptionsFactory,
            inject: [ConfigService]
        })
    ],
    controllers: [VideoController],
    providers: [
        UploadFilesCommandHandler,
        GetVideoPathQueryHandler,
        GetVideoListQueryHandler
    ]
})
export class VideoModule {}