import { IQuery } from "@nestjs/cqrs";

export class GetBeforeSummaryVideoPathQuery implements IQuery{
    constructor( readonly userId: string ) {}
}