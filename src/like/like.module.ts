import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { IsLikedVideoQueryHandler } from 'src/like/query/is-liked-video-query.handler';
import { RedisModule } from '../redis/redis.module';
import { AddLikeCommandHandler } from './command/add-like-command.handler';
import { CancelLikeCommandHandler } from './command/cancel-like-command.handler';
import { AddLikeEventHandler } from './event/add-like-event.handler';
import { CancelLikeEventHandler } from './event/cancel-like-event.handler';
import { LikeController } from './like.controller';

@Module({
    imports: [
        RedisModule,
        CqrsModule
    ],
    providers: [
        AddLikeCommandHandler,
        CancelLikeCommandHandler,
        IsLikedVideoQueryHandler,
        AddLikeEventHandler,
        CancelLikeEventHandler
    ],
    controllers: [LikeController],
})
export class LikeModule {}