import { IEvent } from "@nestjs/cqrs";

export class UploadVideoCompleteEvent implements IEvent {
    constructor( public readonly originVideoPath: string ) {}
}