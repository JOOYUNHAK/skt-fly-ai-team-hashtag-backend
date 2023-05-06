import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { VideoDeletedEvent } from "../video-deleted.event";
import { MediaRepository } from "src/video/infra/adapter/media.repository";

@EventsHandler(VideoDeletedEvent)
export class VideoDeletedEventHandler implements IEventHandler<VideoDeletedEvent> {
    constructor(
        private readonly mediaRepository: MediaRepository
    ) {}
    /* 사용자가 요약된 영상 저장하지 않으면 실제 미디어 파일들 삭제 */
    async handle(event: VideoDeletedEvent) {
        const video = event.video;
        const [metaInfo, summaryInfo ] = [video.getMetaInfo(), video.getSummaryInfo()];
        await this.mediaRepository.delete([
            ...metaInfo.originVideoPath,
            summaryInfo.imagePath,
            summaryInfo.videoPath
        ])
    }
}