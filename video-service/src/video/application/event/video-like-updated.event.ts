import { IEvent } from "@nestjs/cqrs";
import { Like } from "src/video/domain/like/like";

export class VideoLikeUpdatedEvent implements IEvent {
    constructor( readonly like: Like ) {}
}