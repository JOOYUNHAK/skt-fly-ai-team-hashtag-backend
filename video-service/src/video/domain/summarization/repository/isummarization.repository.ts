import { Summarization } from "../entity/summarization.entity";

export interface ISummarizationRepository {
    findById: (id: number) => Promise<Summarization>;
}