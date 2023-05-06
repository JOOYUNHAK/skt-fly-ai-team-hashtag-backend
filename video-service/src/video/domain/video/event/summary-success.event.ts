import { IEvent } from "@nestjs/cqrs";
import { Video } from "../video-domain";

export class SummarySuccessEvent implements IEvent {
    constructor( readonly video: Video ) {}
}