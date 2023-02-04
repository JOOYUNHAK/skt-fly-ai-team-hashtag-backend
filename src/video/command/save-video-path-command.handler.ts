import { Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { RedisClientType } from "redis";
import { SaveVideoPathCommand } from "./save-video-path.command";

@CommandHandler(SaveVideoPathCommand)
export class SaveVideoPathCommandHandler implements ICommandHandler<SaveVideoPathCommand> {
    constructor(
        @Inject('REDIS_CLIENT')
        private readonly redis: RedisClientType
    ) {}
    async execute(command: SaveVideoPathCommand): Promise<any> {
        const { userId, videoPath } = command;
        await this.redis.HSET('process:video:list', `user:${userId}`, videoPath);
    }
}