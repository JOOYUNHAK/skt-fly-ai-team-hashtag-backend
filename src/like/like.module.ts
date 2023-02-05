import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { DatabaseModule } from 'src/database/database.module';
import { IsLikedVideoQueryHandler } from 'src/like/query/is-liked-video-query.handler';
import { RedisModule } from '../redis/redis.module';
import { AddLikeCommandHandler } from './command/add-like-command.handler';
import { CancelLikeCommandHandler } from './command/cancel-like-command.handler';
import { AddLikeEventHandler } from './event/add-like-event.handler';
import { CancelLikeEventHandler } from './event/cancel-like-event.handler';
import { LikeController } from './like.controller';
import { GetLikeListQueryHandler } from './query/get-like-list-query.handler';
import { GetLikeListQuery } from './query/get-like-list.query';

@Module({
    imports: [
        RedisModule,
        CqrsModule,
        DatabaseModule
    ],
    providers: [
        AddLikeCommandHandler,
        CancelLikeCommandHandler,
        IsLikedVideoQueryHandler,
        AddLikeEventHandler,
        CancelLikeEventHandler,
        GetLikeListQueryHandler,
    ],
    controllers: [LikeController],
})
export class LikeModule {}