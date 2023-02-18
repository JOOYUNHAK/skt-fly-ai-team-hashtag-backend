import { IEvent } from "@nestjs/cqrs";

export class UploadVideoCompleteEvent implements IEvent {
    constructor( 
        public readonly thumbNailPath: string,
        public readonly videoPath: string,
        public readonly originVideoPath: string[]
    ) {}
}