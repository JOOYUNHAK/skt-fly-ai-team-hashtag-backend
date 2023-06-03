import { Summarization } from "src/video/domain/summarization/entity/summarization.entity";

export class TestSummarization {
    static create(userId: string, originVideoPath: string[], category: string[]): Summarization {
        return new Summarization(userId, originVideoPath, category);
    };
}