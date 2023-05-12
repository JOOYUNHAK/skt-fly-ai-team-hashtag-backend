import { Inject } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { AggregationCursor, Db } from "mongodb";
import { GetHotVideoListPipeLine, GetRecentVideoListPipeLine } from "../../infra/database/pipeline/video.pipeline";
import { GetVideoListQuery } from "./get-video-list.query";
import { RedisClientType } from "redis";

@QueryHandler(GetVideoListQuery)
export class GetVideoListQueryHandler implements IQueryHandler<GetVideoListQuery> {
    constructor(
        @Inject('MONGO_CONNECTION')
        private readonly db: Db,
        @Inject('REDIS_CLIENT')
        private readonly redis: RedisClientType
    ) { }
    async execute(query: GetVideoListQuery): Promise<any> {
        const [recentCursor, hottestCursor] = [
            /* 최신 비디오 */
            this.db
                .collection('video')
                .aggregate(GetRecentVideoListPipeLine),
            /* 좋아요 순 비디오 */
            this.db
                .collection('video')
                .aggregate(GetHotVideoListPipeLine, { hint: 'likeCount_-1' }),
        ];

        return this.validateLikeAndCursorToArray(query.userId, recentCursor, hottestCursor);
    }

    /**
     * 영상 리스트 목록에서도 좋아요 표시가 나타나기 때문에 
     * Cursor를 돌면서 로그인한 사용자는 해당 비디오에 좋아요 눌렀는지 여부 return 
     */
    async validateLikeAndCursorToArray(
        userId: number, recentCursor: AggregationCursor, hottestCursor: AggregationCursor
    ) {
        const [documentsSortByLike, documentsSortByRecent] = [[], []];

        await Promise.all([
            recentCursor.forEach(doc => {
                doc._id = doc._id.toString();
                doc.isLiked = 0;
                documentsSortByRecent.push(doc);
            }),
            hottestCursor.forEach((doc) => {
                doc._id = doc._id.toString();
                doc.isLiked = 0;
                documentsSortByLike.push(doc);
            })
        ])

        if (!userId) return { hottest: documentsSortByLike, recent: documentsSortByRecent };

        const checkLikedRecentDocuments = await Promise.all(
            documentsSortByRecent.map(async (doc) => {
                doc.isLiked = await this.redis.HEXISTS(`user:${userId}:like-videos`, doc._id);
                return doc
            }));
        const checkLikedHotDocuments = await Promise.all(
            documentsSortByLike.map(async doc => {
                doc.isLiked = await this.redis.HEXISTS(`user${userId}:like-videos`, doc._id);
                return doc;
            })
        )

        return { hottest: checkLikedHotDocuments, recent: checkLikedRecentDocuments };
    }
}
