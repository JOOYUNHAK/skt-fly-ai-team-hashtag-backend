import { IEvent } from "@nestjs/cqrs";

export class SummaryCompleteEvent implements IEvent {
    constructor(
        readonly userId: string,
        readonly nickName: string,
        readonly thumbNailPath: string,
        readonly videoPath: string,
        readonly tags: string[],
        readonly category: string[]
    ) {}
}