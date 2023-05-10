import { IQuery } from "@nestjs/cqrs";

export class GetVideoDetailQuery implements IQuery {
    constructor( readonly videoId: string ) {}
}