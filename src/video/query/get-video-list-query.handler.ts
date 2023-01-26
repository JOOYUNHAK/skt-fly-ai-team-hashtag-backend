import { Inject } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { Db } from "mongodb";
import { GetVideoListQuery } from "./get-video-list.query";

@QueryHandler(GetVideoListQuery)
export class GetVideoListQueryHandler implements IQueryHandler<GetVideoListQuery> {
    constructor(
        @Inject('MONGO_CONNECTION')
        private readonly db: Db
    ) { }
    async execute(query: GetVideoListQuery): Promise<any> {
        // 최신 비디오
        const result = await this.db
            .collection('videos')
            .aggregate([
                {
                    "$project": {
                        "_id": 1,
                        "owner": 1,
                        "videoPath": 1,
                        "thumbNailPath": 1,
                        "uploadedAt": {
                            "$divide": [
                                {
                                    "$subtract": [
                                        new Date().getTime(),
                                        "$uploadedAt"
                                    ]
                                },
                                1000
                            ]
                        }

                    }
                }
            ])
            .sort({ uploadedAt: 1 })
            .toArray();
    }
}