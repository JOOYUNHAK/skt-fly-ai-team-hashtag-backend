import { Inject } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { RedisClientType } from "redis";
import { GetTempVideoDataQuery } from "./get-temp-video-data.query";

@QueryHandler(GetTempVideoDataQuery)
export class GetTempVideoDataQueryHandler implements IQueryHandler<GetTempVideoDataQuery> {
    constructor(
        @Inject('REDIS_CLIENT')
        private readonly redis: RedisClientType
    ) {}

    async execute(query: GetTempVideoDataQuery): Promise<any> {
        const { userId } = query;
        /* 일시적으로 저장해 놓은 데이터는 사용자를 Key로
           JSON.stringify로 넣은 값을 Value로 해놓았기 때문에 Parsing이 필요 */
        return JSON.parse( await this.redis.HGET('process:video:list', `user:${userId}`) );
    }
}