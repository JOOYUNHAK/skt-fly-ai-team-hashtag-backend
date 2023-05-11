import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { VideoLikeUpdatedEvent } from "../video-like-updated.event";
import { Inject } from "@nestjs/common";
import { RedisClientType } from "redis";

@EventsHandler(VideoLikeUpdatedEvent)
export class VideoLikeUpdatedEventHandler implements IEventHandler<VideoLikeUpdatedEvent> {
    constructor(
        @Inject('REDIS_CLIENT')
        private readonly redis: RedisClientType
    ) {}
    
    async handle(event: VideoLikeUpdatedEvent) {
        const { like } = event;
        const [videoId, userId] = [like.videoId, like.userId];
        like.isDuplicated() ? 
            this.deleteLikeList(videoId, userId) : 
                    this.addLikeList(videoId, userId);
    }

    async deleteLikeList(videoId: string, userId: number) {
        await Promise.all([ 
            this.redis.SETBIT(`video:${videoId}:likers`, userId, 0),
            this.redis.HDEL(`user:${userId}:like-videos`, videoId)
        ]);
    }

    async addLikeList(videoId:string, userId: number) {
        await Promise.all([ 
            this.redis.SETBIT(`video:${videoId}:likers`, userId, 1),
            this.redis.HSET(`user:${userId}:like-videos`, videoId, 1)
        ]);
    }
}