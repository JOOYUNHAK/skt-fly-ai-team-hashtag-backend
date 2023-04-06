import { IQuery } from "@nestjs/cqrs";

export class GetLikeListQuery implements IQuery {
    constructor( public readonly userId: string ) {};
}