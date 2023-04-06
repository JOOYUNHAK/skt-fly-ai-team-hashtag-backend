import { ICommandHandler, CommandHandler, EventBus } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { RedisClientType } from 'redis';
import { AddLikeCommand } from './add-like.command';
import { AddLikeEvent } from '../event/add-like.event';

@CommandHandler(AddLikeCommand)
export class AddLikeCommandHandler implements ICommandHandler<AddLikeCommand> {
    constructor(
        @Inject('REDIS_CLIENT')
        private readonly redis: RedisClientType,
        private readonly eventBus: EventBus
    ) {}
    async execute(command: AddLikeCommand): Promise<any> {
        const { userId, videoId } = command;
        await this.redis.HSET(`video:${videoId}:like:user`, userId, 1); // 비디오 좋아요 목록에 사용자 추가
        this.eventBus.publish(new AddLikeEvent(userId, videoId)); // 좋아요 event 발생
    }
}