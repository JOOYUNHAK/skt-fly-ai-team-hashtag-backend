import { Video } from "../video-domain";

export interface IVideoRepository {
    updateSummaryInfo: (video: Video) => Promise<void>;
    findSummaryInfoById: (videoId: string) => Promise<Video>;
}