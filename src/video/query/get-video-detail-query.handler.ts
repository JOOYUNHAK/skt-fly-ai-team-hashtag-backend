import { Inject } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { Db, Document, ObjectId, WithId } from "mongodb";
import { VideDetailInfo } from "../interface/video.interface";
import { GetVideoDetailQuery } from "./get-video-detail.query";

@QueryHandler(GetVideoDetailQuery)
export class GetVideoDetailQueryHandler implements IQueryHandler<GetVideoDetailQuery> {
    constructor(
        @Inject('MONGO_CONNECTION')
        private readonly db: Db
    ) { }

    async execute({ videoId }: GetVideoDetailQuery): Promise<WithId<Document>> {
        return await this.db
            .collection<VideDetailInfo>('video')
            .findOne(
                { _id: new ObjectId(videoId) },
                { projection: { 
                    _id: 1,
                    nickName: 1,
                    title: 1,
                    tags: 1,
                    likeCount: 1,
                    uploadedAt: 1,
                    videoPath: 1,
                 } }
            )
    }
}