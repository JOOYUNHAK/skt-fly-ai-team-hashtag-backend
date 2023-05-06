import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { VideoRepository } from "src/video/infra/database/video.repository";
import { SummaryFailEvent } from '../../../domain/video/event/summary-fail.event';

@EventsHandler(SummaryFailEvent)
export class SummaryFailEventHandler implements IEventHandler<SummaryFailEvent> {
    constructor(
        private readonly videoRepository: VideoRepository
    ) {}
    async handle(event: SummaryFailEvent) {
        await this.videoRepository.deleteSummaryInfoById(event.video.getId());
    }
}