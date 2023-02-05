import { Inject } from "@nestjs/common";
import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { Db, ObjectId } from "mongodb";
import { RedisClientType } from "redis";
import { AddLikeEvent } from "./add-like.event";

@EventsHandler(AddLikeEvent)
export class AddLikeEventHandler implements IEventHandler<AddLikeEvent> {
    constructor( 
        @Inject('REDIS_CLIENT')
        private readonly redis: RedisClientType,
        @Inject('MONGO_CONNECTION')
        private readonly db: Db
    ) {}

    async handle(event: AddLikeEvent) {
        console.log('add like event...')
        const {userId, videoId } = event;
        await Promise.all([
            /* 해당 비디오 좋아요 수 1 증가 */
            this.db
            .collection('video')
            .updateOne(
                { _id: new ObjectId(videoId) },
                { $inc: { likeCount: 1 }}
            ),
            /* 해당 비디오 사용자 별 좋아요 목록에 추가 */
            this.redis.SADD(`user:${userId}:like:video`, videoId), 
        ]);
    }
}