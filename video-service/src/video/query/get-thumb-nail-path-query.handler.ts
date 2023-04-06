import { Inject } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { Db, Document, ObjectId } from "mongodb";
import { GetThumbNailPathDto } from "../dto/get-thumb-nail-path.dto";
import { GetThumbNailPathPipeLine } from "../pipeline/video.pipeline";
import { GetThumbNailPathQuery } from "./get-thumb-nail-path.query";

@QueryHandler(GetThumbNailPathQuery)
export class GetThumbNailPathQueryHandler implements IQueryHandler<GetThumbNailPathQuery> {
    constructor(
        @Inject('MONGO_CONNECTION')
        private readonly db: Db
    ) {}

    async execute({ userId }: GetThumbNailPathQuery): Promise<Document[]> {
        return await this.db
            .collection('video')
            .aggregate(GetThumbNailPathPipeLine(userId))
            .toArray();
    }
}