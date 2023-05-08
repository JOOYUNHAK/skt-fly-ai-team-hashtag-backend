import { IEvent } from "@nestjs/cqrs";
import { VideoSummarization } from "src/video/domain/summarization/video-summarization";

export class NotUploadedVideoEvent implements IEvent {
    constructor( readonly summarization: VideoSummarization ) {}
}