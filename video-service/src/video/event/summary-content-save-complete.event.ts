import { IEvent } from "@nestjs/cqrs";

export class SummaryContentSaveCompleteEvent implements IEvent {
    constructor(
        readonly userId: string,
        readonly nickName: string,
        readonly s3VideoURL: string,
        readonly s3ImageURL: string,
        readonly tags: string []
    ) {}
}