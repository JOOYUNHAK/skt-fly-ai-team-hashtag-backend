import { Inject } from "@nestjs/common";
import { IVideoRepository } from "../../domain/video/repository/ivideo.repository";
import { Db } from "mongodb";
import { Video } from "src/video/domain/video/entity/video.entity";

export class VideoRepository implements IVideoRepository {
    constructor(
        @Inject('MONGO_CONNECTION')
        private readonly db: Db
    ) {}
    
    async save(video: Video): Promise<void> {
        await this.db
                .collection('video')
                .insertOne({
                    ...video,
                    uploadedAt: new Date()
                });
    }
}