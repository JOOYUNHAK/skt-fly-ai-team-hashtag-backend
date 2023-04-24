import { IQueryHandler } from "@nestjs/cqrs";
import { GetBeforeSummaryVideoPathQuery } from "./get-before-summary-video-path-query";
import { Inject } from "@nestjs/common";
import { RedisClientType } from "redis";

export class GetBeforeSummaryVideoPathQueryHandler implements IQueryHandler<GetBeforeSummaryVideoPathQuery> {
    constructor(
        @Inject('REDIS_CLIENT')
        private readonly redis: RedisClientType
    ) {}
    async execute(query: GetBeforeSummaryVideoPathQuery): Promise<string> {
        return await this.redis.HGET('process:video:list', `user:${query.userId}`);
    }
}