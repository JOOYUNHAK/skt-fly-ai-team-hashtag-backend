import { Inject } from "@nestjs/common";
import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { RedisClientType } from "redis";
import { SaveVideoPathCommand } from "./save-video-path.command";

@CommandHandler(SaveVideoPathCommand)
export class SaveVideoPathCommandHandler implements ICommandHandler<SaveVideoPathCommand> {
    constructor(
        @Inject('REDIS_CLIENT')
        private readonly redis: RedisClientType,
        private readonly eventBus: EventBus
    ) {}
    async execute(command: SaveVideoPathCommand): Promise<any> {
        const { userId, videoPath } = command;
        /* 추후에 필요한 data가 더 추가되므로 문자열로 변경하여 넣어둠 */
        //await this.redis.HSET('process:video:list', `user:${userId}`, videoPath);
        await this.redis.HSET('process:video:list', `user:${userId}`, JSON.stringify(videoPath));
    }
}