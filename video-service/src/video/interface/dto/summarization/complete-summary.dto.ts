import { AutoMap } from "@automapper/classes";

export class CompleteSummaryDto {
    @AutoMap()
    readonly message: string;
    readonly summarizationId: number;
    @AutoMap()
    readonly imagePath: string;
    @AutoMap()
    readonly videoPath: string;
    readonly tags: string[];
}