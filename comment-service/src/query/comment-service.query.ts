import { IQuery } from "@nestjs/cqrs";

export class GetVideoCommentsQuery implements IQuery {
    constructor( public readonly videoId: string ) {}
}