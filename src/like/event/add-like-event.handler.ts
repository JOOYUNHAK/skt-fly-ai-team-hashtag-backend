import { Inject } from "@nestjs/common";
import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { RedisClientType } from "redis";
import { AddLikeEvent } from "./add-like.event";

@EventsHandler(AddLikeEvent)
export class AddLikeEventHandler implements IEventHandler<AddLikeEvent> {
    constructor( 
        @Inject('REDIS_CLIENT')
        private readonly redis: RedisClientType
    ) {}

    async handle(event: AddLikeEvent) {
        const {userId, videoId } = event;
        await Promise.all([
            /* 해당 비디오 사용자 별 좋아요 목록에 추가 */
            this.redis.SADD(`user:${userId}:like:video`, videoId), 
            this.redis.ZINCRBY(`video:sort:by:like`, 1, videoId) // 좋아요 순서 재정렬
        ]);
    }
}