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

    async execute(command: SaveAiResponseCommand): Promise<any> {
        const { userId, thumbNailPath, videoPath, tags } = command;
        const originVideoPath = await this.redis.HGET('process:video:list', `user:${userId}`);
        const tempVideoDataExceptTitle = JSON.stringify({ userId, thumbNailPath, videoPath, tags, originVideoPath });
        await this.redis.HSET('process:video:list', `user:${userId}`, tempVideoDataExceptTitle);
    }
}