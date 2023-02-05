import { Inject } from "@nestjs/common";
import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { Db, ObjectId } from "mongodb";
import { RedisClientType } from "redis";
import { CancelLikeEvent } from "./cancel-like.event";

@EventsHandler(CancelLikeEvent)
export class CancelLikeEventHandler implements IEventHandler<CancelLikeEvent> {
    
    constructor(
        @Inject('REDIS_CLIENT')
        private readonly redis: RedisClientType,
        @Inject('MONGO_CONNECTION')
        private readonly db: Db
    ) {}

    async handle(event: CancelLikeEvent) {
        console.log('cancel...')
        /* 해당 비디오 좋아요 갯수 1 감소 */
        const {userId, videoId } = event;
        await Promise.all([
            this.db
            .collection('video')
            .updateOne(
                { _id: new ObjectId(videoId) },
                { $inc: { likeCount: -1 }}
            ),
            /* 해당 비디오 사용자 별 좋아요 목록에서 삭제 */
            this.redis.SREM(`user:${userId}:like:video`, videoId), 
        ]);
    }
}