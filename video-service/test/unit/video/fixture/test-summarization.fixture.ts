import { SummarizationResult } from "src/video/domain/summarization/entity/summarization-result.entity";
import { Summarization } from "src/video/domain/summarization/entity/summarization.entity";

export class TestSummarization {
    static create(id: number,userId: string, originVideoPath: string[], category: string[]): Summarization {
        return new Summarization(id, userId, originVideoPath, category);
    };
}

export class TestSummarizationResult {
    static create(id: number, message: string, imagePath: string, videoPath: string, tags: string[]) {
        return new SummarizationResult(id, message, imagePath, videoPath, tags);
    }
}