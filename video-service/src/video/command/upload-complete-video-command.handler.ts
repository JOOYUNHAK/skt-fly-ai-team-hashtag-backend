import { Inject } from "@nestjs/common";
import { CommandHandler, EventBus, ICommandHandler, QueryBus } from "@nestjs/cqrs";
import { Db } from "mongodb";
import { RedisClientType } from "redis";
import { UploadVideoCompleteEvent } from "../event/upload-video-complete.event";
import { GetTempVideoDataQuery } from "../query/get-temp-video-data.query";
import { UploadCompleteVideoCommand } from "./upload-complete-video.command";

@CommandHandler(UploadCompleteVideoCommand)
export class UploadCompleteVideoCommandHandler implements ICommandHandler<UploadCompleteVideoCommand> {
    constructor(
        @Inject('REDIS_CLIENT')
        private readonly redis: RedisClientType,
        @Inject('MONGO_CONNECTION')
        private readonly db: Db,
        private readonly queryBus: QueryBus,
        private readonly eventBus: EventBus
    ) {}
    async execute(command: UploadCompleteVideoCommand): Promise<any> {
        const { userId, title } = command;
        let tempVideoData = await this.queryBus.execute(new GetTempVideoDataQuery(userId));
        const { thumbNailPath, videoPath, originVideoPath } = tempVideoData;
        delete tempVideoData['originVideoPath']; //원본 경로 삭제
        // 완료된 동영상 몽고 db에 저장
        await this.db
            .collection('video') 
            .insertOne({...tempVideoData, title, likeCount: 0, uploadedAt: Date.now()});
        // redis temp video data 삭제
        await this.redis.HDEL('process:video:list', `user:${userId}`);
        this.eventBus.publish(new UploadVideoCompleteEvent(thumbNailPath, videoPath, originVideoPath));
    }
}
