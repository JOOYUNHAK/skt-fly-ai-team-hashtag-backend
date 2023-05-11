import { Inject, Injectable } from "@nestjs/common";
import { RedisClientType } from "redis";
import { ILikeRepository } from "src/video/domain/like/repository/ilike.repository";

@Injectable()
export class LikeRepository implements ILikeRepository {
    constructor(
        @Inject('REDIS_CLIENT')
        private readonly redis: RedisClientType
    ) {}
    /* BitMap을 이용하므로 좋아요 누른 사용자면 1 아니면 0 */
    async findByUserAndVideoId (videoId: string, userId: number): Promise<number> {
        return await this.redis.GETBIT(`video:${videoId}:likers`, userId)
    }
}