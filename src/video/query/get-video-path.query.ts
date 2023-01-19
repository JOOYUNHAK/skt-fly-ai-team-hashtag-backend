import { IQuery } from "@nestjs/cqrs";

export class GetVideoPathQuery implements IQuery {
    constructor( readonly videoId: string ) {}
}