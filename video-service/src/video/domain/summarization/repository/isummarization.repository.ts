import { MetaInfoEntity } from "../entity/meta-info.entity";
import { ResultInfo } from "../result-info";
import { VideoSummarization } from "../video-summarization";

export interface ISummarizationRepository {
    save: (MetaInfo: MetaInfoEntity) => Promise<void>;
    delete:(id: string) => Promise<void>;
    findById: (id: string) => Promise<VideoSummarization>;
    updateResultInfo:(resultInfo: ResultInfo) => Promise<void>;
    findAndUpdateOneField:(id: string, field: string, value: any) => Promise<VideoSummarization>;
}