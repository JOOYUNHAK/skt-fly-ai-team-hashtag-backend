export class StartSummaryDto {
    readonly userId: string;
    readonly originVideoPath: string[];
    readonly category: string[];

    static of(userId: string, originVideoPath: string[], category: string[]): StartSummaryDto {
        return { userId, originVideoPath, category };
    }
}