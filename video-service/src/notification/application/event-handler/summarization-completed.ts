import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { SSERepository } from "src/notification/infra/sse.repository";
import { SummarizationCompletedEvent } from "src/video/domain/summarization/event/summarization-completed.event";

@EventsHandler(SummarizationCompletedEvent)
export class SummarizationCompletedEventHandler implements IEventHandler<SummarizationCompletedEvent> {
    constructor(
        private readonly sseRepository: SSERepository
    ) {}

    async handle(event: SummarizationCompletedEvent) {
        const { summarization } = event;
        const userId = summarization.getUserId();
        const emitter = await this.sseRepository.findByUserId(userId);
        /* 요약 결과에 따른 알림 전송 */ 
        summarization.getResult() === 'succeded' ?
            emitter.push( summarization.getOutput()) : emitter.push('SUMMARY_FAILED');

        await this.sseRepository.delete(userId);
    }
}