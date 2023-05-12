import { IQuery } from "@nestjs/cqrs";
export class GetVideoListQuery implements IQuery {
    constructor( readonly userId?: number ) {}
}