import { Video } from "../entity/video.entity";

export interface IVideoRepository {
    save: (video: Video) => Promise<void>;
    findThumbNailByUserId: (userId: number) => Promise<string []>;
}