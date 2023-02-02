import { Inject } from "@nestjs/common";
import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { RedisClientType } from "redis";
import { CancelLikeEvent } from "./cancel-like.event";

@EventsHandler(CancelLikeEvent)
export class CancelLikeEventHandler implements IEventHandler<CancelLikeEvent> {
    
    constructor(
        @Inject('REDIS_CLIENT')
        private readonly redis: RedisClientType
    ) {}

    async handle(event: CancelLikeEvent) {
        console.log('cancel...')
        const {userId, videoId } = event;
        await Promise.all([
            /* 해당 비디오 사용자 별 좋아요 목록에서 삭제 */
            this.redis.SREM(`user:${userId}:like:video`, videoId), 
            this.redis.ZINCRBY(`video:sort:by:like`, -1, videoId) // 좋아요 순서 재정렬
        ]);
    }
}