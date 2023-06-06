import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { SummarizationResult } from "src/video/domain/summarization/entity/summarization-result.entity";
import { Summarization } from "src/video/domain/summarization/entity/summarization.entity";
import { DataSourceOptions } from "typeorm";

export const TestingTypeORMOptions: DataSourceOptions = {
    type: 'mysql',
    host: '127.0.0.1',
    port: 3306,
    username: 'root',
    password: '1234',
    database: 'test',
    entities: [Summarization, SummarizationResult],
    logging: false,
    synchronize: true
}