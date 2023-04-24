import { ICommand } from "@nestjs/cqrs";

export class SaveAiResponseCommand implements ICommand {
    constructor(
        public readonly userId: string,
        public readonly nickName: string,
        public readonly videoPath: string,
        public readonly thumbNailPath: string,
        public readonly tags: string [],
        public readonly category: string[],
        public readonly beforeSummaryVideoPath: string
    ) {}
}