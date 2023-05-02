import { AutoMap } from "@automapper/classes";

export class VideoSummaryInfo {
    @AutoMap()
    readonly videoId: string;
    @AutoMap()
    readonly imagePath: string;
    @AutoMap()
    readonly videoPath: string;
    @AutoMap()
    readonly tags: string[];

    getId() { return this.videoId; };
}   