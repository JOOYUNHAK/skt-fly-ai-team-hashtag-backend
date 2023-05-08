import { ObjectId } from "mongodb";
import { VideoMetaInfo } from "../video-meta-info";
import { SummaryStatus } from "../enum/summary-status.enum";
import { AutoMap } from "@automapper/classes";

export class MetaInfoEntity {
    readonly _id: ObjectId;
    readonly metaInfo: VideoMetaInfo;
    @AutoMap()
    readonly status: SummaryStatus
}