import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { SummarizationCompletedEvent } from "src/video/domain/summarization/event/summarization-completed.event";
import { SummarizationRepository } from "src/video/infra/database/summarization.repository";

@EventsHandler(SummarizationCompletedEvent)
export class SummarizationCompletedEventHandler implements IEventHandler<SummarizationCompletedEvent> {
    constructor(
        private readonly summarizationRepository: SummarizationRepository
    ) {}
    /* 요약 결과에 따라 성공하면 요약 과정 업데이트, 실패하면 삭제 */
    async handle(event: SummarizationCompletedEvent) {
        const { summarization } = event;
        summarization.getResultInfo().getMessage() === 'succeded' ?
            await this.summarizationRepository.updateResultInfo(summarization.getResultInfo()) : 
                await this.summarizationRepository.delete(summarization.getResultInfo().getId());
    }
}