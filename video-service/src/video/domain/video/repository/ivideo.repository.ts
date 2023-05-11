import { VideoComment } from "../../comment/video-comment";
import { Video } from "../entity/video.entity";

export interface IVideoRepository {
    save: (video: Video) => Promise<void>;
    findThumbNailByUserId: (userId: number) => Promise<string []>;
    updateVideoComment: (videoId: string, videoComment: VideoComment) => Promise<void>;
}