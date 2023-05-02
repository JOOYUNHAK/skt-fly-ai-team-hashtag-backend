import { AutoMap } from "@automapper/classes";

export class CompleteSummaryDto {
    @AutoMap()
    readonly videoId: string;
    @AutoMap()
    readonly imagePath: string;
    @AutoMap()
    readonly videoPath: string;
    @AutoMap()
    readonly tags: string[];
}