import { IQuery } from "@nestjs/cqrs";

export class GetTempVideoDataQuery implements IQuery {
    constructor(
        public readonly userId: string,
    ) {}
}