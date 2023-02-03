import { IQuery } from "@nestjs/cqrs";

export class GetMyFeedQuery implements IQuery {
    constructor( readonly id: string ) {}
}