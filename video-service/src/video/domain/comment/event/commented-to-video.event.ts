import { IEvent } from "@nestjs/cqrs";
import { VideoComment } from "../video-comment";

export class CommentedToVideoEvent implements IEvent {
    constructor( readonly videoComment: VideoComment ) {}
}