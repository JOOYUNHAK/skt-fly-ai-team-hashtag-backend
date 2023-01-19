import { Inject } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { Db, ObjectId } from "mongodb";
import { GetVideoPathQuery } from "./get-video-path.query";

@QueryHandler(GetVideoPathQuery)
export class GetVideoPathQueryHandler implements IQueryHandler<GetVideoPathQuery> {
    constructor(
        @Inject('MONGO_CONNECTION')
        private readonly db: Db
    ) { }

    async execute(query: GetVideoPathQuery): Promise<any> {
        return await this.db
            .collection('videos')
            .findOne(
                { _id: new ObjectId(query.videoId) },
                { projection: { _id: 0, videoPath: 1 } }
            )
    }
}