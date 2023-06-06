
export class CompleteSummaryDto {
    readonly summarizationId: number;
    readonly message: string;
    readonly imagePath: string;
    readonly videoPath: string;
    readonly tags: string[];

    static of(
        summarizationId: number, 
        imagePath: string = null,
        videoPath: string = null,
        tags: string [] = null,
        message: string
        ) {
        return {
            summarizationId,
            imagePath,
            videoPath,
            tags,
            message
        };
    };
}