import { ICommand } from "@nestjs/cqrs";

export class SaveAiResponseCommand implements ICommand {
    constructor(
        public readonly userId: string,
        public readonly thumbNailKey: string,
        public readonly videoKey: string,
        public readonly tags: string []
    ) {}
}