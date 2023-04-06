import { IQuery } from '@nestjs/cqrs';

export class IsLikedVideoQuery implements IQuery {
    constructor(
        readonly userId: string,
        readonly videoId: string
    ) {}
} 