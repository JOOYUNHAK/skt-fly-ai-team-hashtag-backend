import { ICommand } from "@nestjs/cqrs";

export class SaveCommentCommand implements ICommand {
    constructor(
        public readonly videoId: string,
        public readonly userId: string,
        public readonly nickName: string,
        public readonly content: string
    ) {}
}