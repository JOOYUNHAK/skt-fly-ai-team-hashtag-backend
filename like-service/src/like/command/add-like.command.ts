import { ICommand } from '@nestjs/cqrs';

export class AddLikeCommand implements ICommand {
    constructor(
        readonly userId: string,
        readonly videoId: string
    ) {}
}