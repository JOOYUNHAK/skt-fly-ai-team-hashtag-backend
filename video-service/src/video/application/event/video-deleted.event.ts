import { IEvent } from "@nestjs/cqrs";
import { Video } from "src/video/domain/video/video-domain";

export class VideoDeletedEvent implements IEvent {
    constructor( readonly video: Video ) {}
}