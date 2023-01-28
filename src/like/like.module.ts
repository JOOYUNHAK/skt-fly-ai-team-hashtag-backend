import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { IsLikedVideoQueryHandler } from 'src/like/query/is-liked-video-query.handler';
import { RedisModule } from '../redis/redis.module';
import { AddLikeCommandHandler } from './command/add-like-command.handler';
import { CancelLikeCommandHandler } from './command/cancel-like-command.handler';
import { LikeController } from './like.controller';

@Module({
    imports: [
        RedisModule,
        CqrsModule
    ],
    providers: [
        AddLikeCommandHandler,
        CancelLikeCommandHandler,
        IsLikedVideoQueryHandler
    ],
    controllers: [LikeController],
})
export class LikeModule {}