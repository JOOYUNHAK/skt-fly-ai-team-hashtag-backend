import { AutoMap } from "@automapper/classes";
import { SummaryStatus } from "src/video/domain/video/enum/summary-status.enum";

export class CompleteSummaryDto {
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
}