import { IEvent } from "@nestjs/cqrs";
import { Video } from "../video-domain";

export class SummaryFailEvent implements IEvent {
    constructor( readonly video: Video ) {}
}