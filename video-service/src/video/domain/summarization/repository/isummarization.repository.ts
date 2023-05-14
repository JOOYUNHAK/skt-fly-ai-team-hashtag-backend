import { Summarization } from "../entity/summarization.entity";

export interface ISummarizationRepository {
    save: (summariztion: Summarization) => Promise<Summarization>;
    delete:(id: Summarization) => Promise<void>;
    findById: (id: number) => Promise<Summarization>;
}