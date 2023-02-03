import { IQuery } from "@nestjs/cqrs";

export class GetThumbNailPathQuery implements IQuery {
    constructor( public readonly userId: string ) {}
}