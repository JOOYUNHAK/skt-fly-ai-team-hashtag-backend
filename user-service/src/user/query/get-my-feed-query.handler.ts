import { Inject } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { ClientGrpc } from "@nestjs/microservices";
import { GetMyFeedQuery } from "./get-my-feed.query";

@QueryHandler(GetMyFeedQuery)
export class GetMyFeedQueryHandlerr implements IQueryHandler<GetMyFeedQuery> {
    constructor(
        @Inject('USER_PACKAGE')
        private readonly client: ClientGrpc
    ) {}
    async execute(query: GetMyFeedQuery): Promise<any> {
        
    }
}