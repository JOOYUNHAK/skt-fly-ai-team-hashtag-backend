import { ObjectId } from "mongodb";
import { VideoComment } from "../../comment/video-comment";
import { Video } from "../entity/video.entity";

export interface IVideoRepository {
    save: (video: Video) => Promise<void>;
    findThumbNailByUserId: (userId: number) => Promise<string []>;
    updateVideoComment: (videoId: ObjectId, videoComment: VideoComment) => Promise<void>;
    updateVideoLike: (videoId: string, value: number) => Promise<void>;
}