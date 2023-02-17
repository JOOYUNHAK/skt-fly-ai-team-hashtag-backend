import { Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { RedisClientType } from "redis";
import { SaveAiResponseCommand } from "./save-ai-response.command";

@CommandHandler(SaveAiResponseCommand)
export class SaveAiResponseCommandHandler implements ICommandHandler<SaveAiResponseCommand> {
    constructor(
        @Inject('REDIS_CLIENT')
        private readonly redis: RedisClientType
    ) {}

    /* 요약된 영상 제목 입력 받기 전 임시 데이터 합쳐서 저장 */
    async execute(command: SaveAiResponseCommand): Promise<any> {
        const { userId, nickName, thumbNailPath, videoPath, tags } = command;
        const originVideoPath = await this.redis.HGET('process:video:list', `user:${userId}`);
        console.log('originVideoPath.........->', originVideoPath)
        const tempVideoDataExceptTitle = JSON.stringify({ userId, nickName, thumbNailPath, videoPath, tags, originVideoPath });
        await this.redis.HSET('process:video:list', `user:${userId}`, tempVideoDataExceptTitle);
    }
}       