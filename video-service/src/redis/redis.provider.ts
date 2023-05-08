import { ConfigModule, ConfigService } from '@nestjs/config';
import { createClient } from 'redis';

export const redisProvider = [
    {
        provide: 'REDIS_CLIENT',
        import: [ConfigModule],
        inject: [ConfigService],
        useFactory: async (configService: ConfigService) => {
            const client = createClient({
                url: configService.get('redis.url')
            });
            await client.connect();
            return client;
        }
    }
]
