import { SummarizationResult } from "src/video/domain/summarization/entity/summarization-result.entity";
import { DataSource } from "typeorm";

export const SummarizationResultProvider = [
    {
        provide: 'SUMMARIZATION_RESULT_REPOSITORY',
        useFactory: (dataSource: DataSource) => dataSource.getRepository(SummarizationResult), 
        inject: ['DATA_SOURCE']
    }
]