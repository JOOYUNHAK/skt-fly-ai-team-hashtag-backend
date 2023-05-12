import { Inject } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { Db, ObjectId } from "mongodb";
import { GetVideoDetailQuery } from "./get-video-detail.query";
import { Video } from "src/video/domain/video/entity/video.entity";

@QueryHandler(GetVideoDetailQuery)
export class GetVideoDetailQueryHandler implements IQueryHandler<GetVideoDetailQuery> {
    constructor(
        @Inject('MONGO_CONNECTION')
        private readonly db: Db
    ) { }

    async execute({ videoId }: GetVideoDetailQuery): Promise<Video> {
        return await this.db
            .collection('video')
            .findOne<Video>({ _id: new ObjectId(videoId) });
    }
}
