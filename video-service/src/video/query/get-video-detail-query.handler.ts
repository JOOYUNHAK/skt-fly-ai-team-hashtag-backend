import { Inject } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { Db, Document, ObjectId, WithId } from "mongodb";
import { GetVideoDetailPipeLine } from "../pipeline/video.pipeline";
import { GetVideoDetailQuery } from "./get-video-detail.query";

@QueryHandler(GetVideoDetailQuery)
export class GetVideoDetailQueryHandler implements IQueryHandler<GetVideoDetailQuery> {
    constructor(
        @Inject('MONGO_CONNECTION')
        private readonly db: Db
    ) { }

    async execute({ videoId }: GetVideoDetailQuery): Promise<any> {
        return await this.db
            .collection('video')
            .aggregate(GetVideoDetailPipeLine(videoId))
            .toArray()
        }
}
