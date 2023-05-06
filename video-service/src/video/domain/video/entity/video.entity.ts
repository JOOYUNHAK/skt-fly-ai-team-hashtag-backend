import { AutoMap } from "@automapper/classes";
import { ObjectId } from "mongodb";
import { VideoMetaInfo } from "../video-meta-info";

export class VideoEntity {
    _id: ObjectId;
    metaInfo: VideoMetaInfo;
    imagePath: string;
    videoPath: string;
    tags: string [];
    @AutoMap()
    title: string;
}