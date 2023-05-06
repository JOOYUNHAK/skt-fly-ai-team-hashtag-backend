import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { SSERepository } from "src/notification/infra/sse.repository";
import { SummarySuccessEvent } from "src/video/domain/video/event/summary-success.event";

@EventsHandler(SummarySuccessEvent) 
export class SummarySuccessEventHandler implements IEventHandler<SummarySuccessEvent> {
    constructor(
        private readonly sseRepository: SSERepository,
    ) {}
    /* 사용자에게 완료 알림 */
    async handle(event: SummarySuccessEvent) {
        const emitter = await this.sseRepository.findByUserId(event.video.getOwnerId());
        emitter.push(event.video);
    }
}
