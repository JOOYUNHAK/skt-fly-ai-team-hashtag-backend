import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { SummaryFailEvent } from "./summary-fail-event";
import { Inject } from "@nestjs/common";
import { RedisClientType } from "redis";

@EventsHandler(SummaryFailEvent)
export class SummaryFailEventHandler implements IEventHandler<SummaryFailEvent> {
    constructor(
        @Inject('REDIS_CLIENT')
        private readonly redis: RedisClientType
    ) {}
    /* 사용자한테 SSE PUSH이후 Instance 삭제 */
    async handle(event: SummaryFailEvent) {
        const key = `user:${event.userId}`;
        const session = JSON.parse( await this.redis.HGET('sse:session:list', key) );
        await Promise.all([
            session.push('SERVER_ERROR'),
            this.redis.HDEL('sse:session:list', key)   
        ]);
    }
}