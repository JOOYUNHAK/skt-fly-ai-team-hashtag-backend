import { ConfigModule, ConfigService } from '@nestjs/config';
import { SummarizationResult } from 'src/video/domain/summarization/entity/summarization-result.entity';
import { Summarization } from 'src/video/domain/summarization/entity/summarization.entity';
import { DataSource } from 'typeorm';

export const mysqlProviders = [
    {
        provide: 'DATA_SOURCE',
        import: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => {
            const datasource = new DataSource({
                type: 'mysql',
                host: configService.get('mysql.host'),
                port: configService.get('mysql.port'),
                username: configService.get('mysql.username'),
                password: configService.get('mysql.password'),
                database: configService.get('mysql.database'),
                entities: [Summarization, SummarizationResult],
                synchronize: true,
                logging: true
            });
            return datasource.initialize();
        }
    }
];