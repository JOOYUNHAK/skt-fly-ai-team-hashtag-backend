import { ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { RedisClientType } from 'redis';
import { AddLikeCommand } from './add-like.command';

@CommandHandler(AddLikeCommand)
export class AddLikeCommandHandler implements ICommandHandler<AddLikeCommand> {
    constructor(
        @Inject('REDIS_CLIENT')
        private readonly redis: RedisClientType
    ) {}
    async execute(command: AddLikeCommand): Promise<any> {
        const { userId, videoId } = command;
        await this.redis.HSET(`video:${videoId}:like:user`, userId, 1);
    }
}