import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from 'src/user/domain/entity/user.entity';
import { DataSource } from 'typeorm';

export const mysqlProviders = [
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