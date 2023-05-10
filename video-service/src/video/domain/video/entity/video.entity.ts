import { AutoMap } from "@automapper/classes";
import { ObjectId } from "mongodb";

export class Video {
    @AutoMap()
    readonly _id?: ObjectId;
    readonly summarizationId: string;
    readonly userId: number;
    readonly nickName: string;
    readonly imagePath: string;
    readonly videoPath: string;
    readonly tags: string[];
    @AutoMap()
    readonly title: string;
    @AutoMap()
    readonly uploadedAt?: Date;
}