import { IEvent } from "@nestjs/cqrs";
import { Video } from "../video-domain";

export class SummaryCompleteEvent implements IEvent {
    constructor( readonly video: Video ) {}
}