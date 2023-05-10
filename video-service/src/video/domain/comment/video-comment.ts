import { AutoMap } from "@automapper/classes";
import { AggregateRoot } from "@nestjs/cqrs";
import { ObjectId } from "mongodb";
import { CommentedToVideoEvent } from "./event/commented-to-video.event";

export class VideoComment extends AggregateRoot{
    readonly _id?: ObjectId;
    @AutoMap()
    readonly videoId: string;
    @AutoMap()
    readonly userId: number;
    @AutoMap()
    readonly nickName: string;
    @AutoMap()
    readonly content: string;
    readonly commentedAt: Date;

    commented() {
        this.apply(new CommentedToVideoEvent(this));
    }
}