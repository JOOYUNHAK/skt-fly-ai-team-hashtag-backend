import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { CommentedToVideoEvent } from "src/video/domain/comment/event/commented-to-video.event";
import { VideoRepository } from "src/video/infra/database/video.repository";

@EventsHandler(CommentedToVideoEvent)
export class CommentedToVideoEventHandler implements IEventHandler<CommentedToVideoEvent> {
    constructor(
        private readonly videoRepository: VideoRepository
    ) {}
    /* 댓글이 추가되었다는 이벤트를 받으면 비디오 저장소는 최신 댓글 갱신 */
    async handle(event: CommentedToVideoEvent) {
        const { videoComment } = event;
        await this.videoRepository.updateVideoComment(videoComment.videoId, videoComment);
    }
}