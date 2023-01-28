import { Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { RedisClientType } from "redis";
import { CancelLikeCommand } from "./cancel-like.command";

@CommandHandler(CancelLikeCommand)
export class CancelLikeCommandHandler implements ICommandHandler<CancelLikeCommand> {
    constructor(
        @Inject('REDIS_CLIENT')
        private readonly redis: RedisClientType
    ) {}
    
    async execute(command: CancelLikeCommand): Promise<any> {
        const { userId, videoId } = command;
        await this.redis.HDEL(`video:${videoId}:like:user`, userId);
    }
}