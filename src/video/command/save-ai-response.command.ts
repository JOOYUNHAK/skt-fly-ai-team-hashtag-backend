import { ICommand } from "@nestjs/cqrs";

export class SaveAiResponseCommand implements ICommand {
    constructor(
        public readonly userId: string,
        public readonly thumbNailPath: string,
        public readonly videoPath: string,
        public readonly videoTag: string []
    ) {}
}