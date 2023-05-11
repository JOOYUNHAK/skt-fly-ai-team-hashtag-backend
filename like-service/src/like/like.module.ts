import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { DatabaseModule } from 'src/database/database.module';
import { RedisModule } from '../redis/redis.module';
import { LikeController } from './like.controller';
import { GetLikeListQueryHandler } from './query/get-like-list-query.handler';

@Module({
    imports: [
        RedisModule,
        CqrsModule,
        DatabaseModule
    ],
    providers: [
        GetLikeListQueryHandler,
    ],
    controllers: [LikeController],
})
export class LikeModule {}