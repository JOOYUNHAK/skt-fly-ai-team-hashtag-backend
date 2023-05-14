import { Summarization } from "src/video/domain/summarization/entity/summarization.entity";
import { DataSource } from "typeorm";

export const SummarizationProvider = [
    {
        provide: 'SUMMARIZATION_REPOSITORY',
        useFactory: (dataSource: DataSource) => dataSource.getRepository(Summarization), 
        inject: ['DATA_SOURCE']
    }
]