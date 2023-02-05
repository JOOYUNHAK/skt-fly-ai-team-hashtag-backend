import { Inject } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { RedisClientType } from "redis";
import { GetLikeListQuery } from "./get-like-list.query";

@QueryHandler(GetLikeListQuery)
export class GetLikeListQueryHandler implements IQueryHandler<GetLikeListQuery> {
    
    constructor(
        @Inject('REDIS_CLIENT')
        private readonly redis: RedisClientType
    ) {}

    async execute(query: GetLikeListQuery): Promise<string []> {
        console.log('get like list request....')
        const { userId } = query;
        return await this.redis.SMEMBERS(`user:${userId}:like:video`);
    }
}