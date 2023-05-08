import { IEvent } from "@nestjs/cqrs";
import { VideoSummarization } from "../video-summarization";

export class SummarizationCompletedEvent implements IEvent {
    constructor( readonly summarization: VideoSummarization ) {}
}