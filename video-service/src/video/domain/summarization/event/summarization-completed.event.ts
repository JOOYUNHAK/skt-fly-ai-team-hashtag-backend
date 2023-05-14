import { IEvent } from "@nestjs/cqrs";
import { Summarization } from "../entity/summarization.entity";

export class SummarizationCompletedEvent implements IEvent {
    constructor( readonly summarization: Summarization ) {}
}