import { VideoComment } from "../video-comment";

export class ICommentRepository {
    save: (videoComment: VideoComment) => Promise<void>
}