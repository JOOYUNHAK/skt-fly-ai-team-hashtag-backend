import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { IsLikedVideoQuery } from './is-liked-video.query';
import { RedisClientType } from 'redis';

@QueryHandler(IsLikedVideoQuery)
export class IsLikedVideoQueryHandler implements IQueryHandler<IsLikedVideoQuery> {
    constructor( 
        @Inject('REDIS_CLIENT') 
        private readonly redis: RedisClientType 
    ) {}

    async execute(query: IsLikedVideoQuery): Promise<boolean> {
        const {userId, videoId} = query;
        if( await this.redis.HGET(`video:${videoId}:like:user`, userId) )
            return true;
        return false; 
    }
}