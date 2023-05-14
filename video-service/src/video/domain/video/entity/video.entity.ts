import { AutoMap } from "@automapper/classes";
import { ObjectId } from "mongodb";
import { VideoComment } from "../../comment/video-comment";

export class Video {
    readonly _id: ObjectId;
    readonly summarizationId: number;
    @AutoMap()
    readonly userId: number;
    private nickName: string;
    readonly imagePath: string;
    readonly videoPath: string;
    readonly tags: string[];
    @AutoMap()
    readonly title: string;
    @AutoMap()
    readonly uploadedAt?: Date;
    readonly likeCount: number;
    readonly comments: VideoComment [];

    setNickName(nickName: string) { 
        this.nickName = nickName;
        return this;
    }
}