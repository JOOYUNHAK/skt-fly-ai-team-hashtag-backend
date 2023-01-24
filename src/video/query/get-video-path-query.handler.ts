import { Inject } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { Db, Document, ObjectId, WithId } from "mongodb";
import { VideoPath } from "../interface/video.interface";
import { GetVideoPathQuery } from "./get-video-path.query";

@QueryHandler(GetVideoPathQuery)
export class GetVideoPathQueryHandler implements IQueryHandler<GetVideoPathQuery> {
    constructor(
        @Inject('MONGO_CONNECTION')
        private readonly db: Db
    ) { }

    async execute(query: GetVideoPathQuery): Promise<WithId<Document>> {
        return await this.db
            .collection<VideoPath>('videos')
            .findOne(
                { _id: new ObjectId(query.videoId) },
                { projection: { _id: 0, videoPath: 1 } }
            )
    }
}