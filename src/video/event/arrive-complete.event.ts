import { IEvent } from "@nestjs/cqrs";

export class ArriveCompleteEvent implements IEvent {
    constructor(
        public readonly userId: string,
        public readonly videoImage: string,
        public readonly videoPath: string,
        public readonly videoTag: string []
    ) {}
}