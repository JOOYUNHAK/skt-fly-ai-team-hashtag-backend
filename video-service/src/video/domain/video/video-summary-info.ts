import { AutoMap } from "@automapper/classes";
import { SummaryStatus } from "./enum/summary-status.enum";

export class VideoSummaryInfo {
    @AutoMap()
    private status: SummaryStatus
    @AutoMap()
    readonly videoId: string;
    @AutoMap()
    readonly imagePath?: string;
    @AutoMap()
    readonly videoPath?: string;
    @AutoMap()
    readonly tags?: string[];

    getId() { return this.videoId; };

    getStatus() { return this.status; };

    startSummary() {
        this.status = SummaryStatus.RUNNING;
    }

    completeSummary() {
        this.status = SummaryStatus.SUCCEED;
    }

}   