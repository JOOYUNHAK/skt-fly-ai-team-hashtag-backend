import { VideoEntity } from "../entity/video.entity";
import { Video } from "../video-domain";

export interface IVideoRepository {
    save: (videoEntity: VideoEntity) => Promise<void>;
    updateSummaryInfo: (video: Video) => Promise<void>;
    findSummaryInfoById: (videoId: string) => Promise<Video>;
    deleteSummaryInfoById: (videoId: string) => Promise<void>;
}