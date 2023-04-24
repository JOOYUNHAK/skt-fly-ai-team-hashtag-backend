import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { SummaryContentSaveCompleteEvent } from "./summary-content-save-complete.event";
import { Inject } from "@nestjs/common";
import { RedisClientType } from "redis";

@EventsHandler(SummaryContentSaveCompleteEvent)
export class SummaryContentSaveCompleteEventHandler implements IEventHandler<SummaryContentSaveCompleteEvent> {
    constructor(
        @Inject('REDIS_CLIENT')
        private readonly redis: RedisClientType
    ) {}    
    async handle(event: SummaryContentSaveCompleteEvent) {
        // session get
        const session = JSON.parse(await this.redis.HGET('sse:session:list', `user:${event.userId}`));
        // sse push
        await session.push({...event});
        // redis session del
        await this.redis.HDEL('sse:session:list', `user:${event.userId}`);
    }
}