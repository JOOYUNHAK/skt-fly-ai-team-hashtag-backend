import { Inject } from "@nestjs/common";
import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { RedisClientType } from "redis";
import { CommunicationErrorAiEvent } from "./communication-error-ai.event";

@EventsHandler(CommunicationErrorAiEvent)
export class CommunicationErrorAiEventHandler implements IEventHandler<CommunicationErrorAiEvent> {
    constructor( 
        @Inject('REDIS_CLIENT')
        private readonly redis: RedisClientType
    ) {}

    async handle(event: CommunicationErrorAiEvent) {
        const { userId } = event;
        await this.redis.HDEL('process:video:list', `user:${userId}`);
        console.log('통신 오류로 temp data 삭제..');
    }
}