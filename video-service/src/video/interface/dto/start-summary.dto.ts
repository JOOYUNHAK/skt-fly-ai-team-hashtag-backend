import { AutoMap } from "@automapper/classes";

export class StartSummaryDto {
    @AutoMap()
    readonly userId: string;
    @AutoMap()
    readonly nickName: string;
    @AutoMap()
    readonly originVideoPath: string[];
    @AutoMap()
    readonly category: string[];
}