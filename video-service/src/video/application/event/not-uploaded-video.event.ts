import { IEvent } from "@nestjs/cqrs";
import { Summarization } from "src/video/domain/summarization/entity/summarization.entity";

export class NotUploadedVideoEvent implements IEvent {
    constructor( readonly summarization: Summarization ) {}
}