import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from 'src/api/v1/user/entity/user.entity';
import { DataSource } from 'typeorm';

export const databaseProviders = [
    {
        provide: 'DATA_SOURCE',
        import: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => {
            const datasource = new DataSource({
                type: 'mysql',
                host: configService.get('database.host'),
                port: configService.get('database.port'),
                username: configService.get('database.username'),
                password: configService.get('database.password'),
                database: configService.get('database.database'),
                entities: [User],
                synchronize: true,
                logging: true
            });
            return datasource.initialize();
        }
    }
];