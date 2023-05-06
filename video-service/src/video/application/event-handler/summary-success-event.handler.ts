import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { SummarySuccessEvent } from "src/video/domain/video/event/summary-success.event";
import { VideoRepository } from "src/video/infra/video.repository";

@EventsHandler(SummarySuccessEvent)
export class SummarySuccessEventHandler implements IEventHandler<SummarySuccessEvent> {
    constructor(
        private readonly videoRepository: VideoRepository
    ) {}

    async handle(event: SummarySuccessEvent) {
        await this.videoRepository.updateSummaryInfo(event.video);
    }
}