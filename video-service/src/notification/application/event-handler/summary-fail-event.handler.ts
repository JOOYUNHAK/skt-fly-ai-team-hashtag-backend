import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { SSERepository } from "src/notification/infra/sse.repository";
import { SummaryFailEvent } from "src/video/domain/video/event/summary-fail.event";

@EventsHandler(SummaryFailEvent)
export class SummaryFailEventHandler implements IEventHandler<SummaryFailEvent> {
    constructor(
        private readonly sseRepository: SSERepository
    ) {}
    /**
     * 
     * @TODO
     * 한번의 이벤트를 보내고 연결을 해제하므로
     * 다른 모듈에서도 연결을 재사용할수있도록
     * 로직을 생각해볼 필요 있음
     */
    async handle(event: SummaryFailEvent) {
        const userId = event.video.getOwnerId();
        const emitter = await this.sseRepository.findByUserId(userId);
        emitter.push('SUMMARY_FAILED');
        this.sseRepository.delete(userId);
    }
}