import { Inject } from "@nestjs/common";
import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { RedisClientType } from "redis";
import { CancelLikeEvent } from "../event/cancel-like.event";
import { CancelLikeCommand } from "./cancel-like.command";

@CommandHandler(CancelLikeCommand)
export class CancelLikeCommandHandler implements ICommandHandler<CancelLikeCommand> {
    constructor(
        @Inject('REDIS_CLIENT')
        private readonly redis: RedisClientType,
        private readonly eventBus: EventBus
    ) {}
    
    async execute(command: CancelLikeCommand): Promise<any> {
        const { userId, videoId } = command;
        await this.redis.HDEL(`video:${videoId}:like:user`, userId);
        this.eventBus.publish(new CancelLikeEvent(userId, videoId)); // 좋아요 취소 event 발생
    }
}