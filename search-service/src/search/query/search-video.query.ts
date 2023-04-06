import { IQuery } from "@nestjs/cqrs";

export class SearchVideoQuery implements IQuery {
    constructor( readonly keyword: string ) {}
}