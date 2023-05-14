import { IEvent } from "@nestjs/cqrs";
import { Summarization } from "../entity/summarization.entity";

export class UploadedSummarizationVideoEvent implements IEvent {
    constructor( readonly summarization: Summarization ) {}
}