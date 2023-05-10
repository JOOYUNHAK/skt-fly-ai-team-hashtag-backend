import { AutoMap } from "@automapper/classes";

export class CompleteSummaryDto {
    @AutoMap()
    readonly message: string;
    @AutoMap()
    readonly summarizationId: string;
    @AutoMap()
    readonly imagePath?: string;
    @AutoMap()
    readonly videoPath?: string;
    @AutoMap()
    readonly tags?: string[];
}