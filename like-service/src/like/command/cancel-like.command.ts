import { ICommand } from "@nestjs/cqrs";

export class CancelLikeCommand implements ICommand {
    constructor(
        readonly userId: string,
        readonly videoId: string
    ) {}
}