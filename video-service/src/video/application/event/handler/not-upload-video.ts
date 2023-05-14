import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { NotUploadedVideoEvent } from "../not-uploaded-video.event";
import { MediaRepository } from "src/video/infra/adapter/media.repository";

@EventsHandler(NotUploadedVideoEvent)
export class NotUploadedVideoEventHandler implements IEventHandler<NotUploadedVideoEvent> {
    constructor(
        private readonly mediaRepository: MediaRepository
    ) {}
    /* 사용자가 요약된 영상 저장하지 않으면 실제 미디어 파일들 삭제 */
    async handle(event: NotUploadedVideoEvent) {
        const summarization = event.summarization;
        const [originVideoPath, output ] = [summarization.getOriginVideoPath(), summarization.getOutput()];
        await this.mediaRepository.delete([
            ...originVideoPath,
            output.getImagePath(),
            output.getVideoPath()
        ])
    }
} 