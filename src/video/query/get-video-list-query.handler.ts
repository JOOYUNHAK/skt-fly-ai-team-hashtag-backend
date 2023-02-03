import { Inject } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { Db } from "mongodb";
import { GetHotVideoListPipeLine, GetRecentVideoListPipeLine } from "../pipeline/video.pipeline";
import { GetVideoListQuery } from "./get-video-list.query";

@QueryHandler(GetVideoListQuery)
export class GetVideoListQueryHandler implements IQueryHandler<GetVideoListQuery> {
    constructor(
        @Inject('MONGO_CONNECTION')
        private readonly db: Db
    ) { }
    async execute(query: GetVideoListQuery): Promise<{ hot: object[], recent: object[]}> {
        const [recentVideoList, hotVideoList] = await Promise.all([
            /* 최신 비디오 */ 
            this.db
                .collection('video')
                .aggregate(GetRecentVideoListPipeLine)
                //.sort({ uploadedAt: 1 })
                .toArray(),
            /* 좋아요 순 비디오 */
            this.db
                .collection('video')
                .aggregate(GetHotVideoListPipeLine)
                .toArray()
        ]);
        return {
            hot: [...hotVideoList ],
            recent: [...recentVideoList ]
        }
    }
}