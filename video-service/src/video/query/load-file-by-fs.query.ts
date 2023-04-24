import { IQuery } from "@nestjs/cqrs";

export class LoadFileByFsQuery implements IQuery {
    constructor(
        readonly videoPath: string,
        readonly thumbNailPath: string
    ) {}
}