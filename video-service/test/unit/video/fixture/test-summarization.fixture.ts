import { Summarization } from "src/video/domain/summarization/entity/summarization.entity";

export class TestSummarization {
    static create(id: number,userId: string, originVideoPath: string[], category: string[]): Summarization {
        return new Summarization(id, userId, originVideoPath, category);
    };
}