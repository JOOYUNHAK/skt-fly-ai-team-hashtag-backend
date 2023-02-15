import { Inject } from "@nestjs/common";
import { Db } from 'mongodb';
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetVideoCommentsQuery } from "../comment-service.query";
import { GetVideoCommentsPipeLine } from "src/pipeline/comment-service.pipeline";

@QueryHandler(GetVideoCommentsQuery)
export class GetVideoCommentsQueryHandler implements IQueryHandler<GetVideoCommentsQuery> {
    constructor(
        @Inject('MONGO_CONNECTION')
        private readonly mongoDb: Db
    ) {}
    async execute(query: GetVideoCommentsQuery): Promise<any> {
        return await this.mongoDb
            .collection('comment')
            .aggregate(GetVideoCommentsPipeLine)
            .toArray();
    }
}