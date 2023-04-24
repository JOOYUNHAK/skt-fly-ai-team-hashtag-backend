import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { SaveSSEInstanceCommand } from "./save-sse-instance.command";
import { Inject } from "@nestjs/common";
import { RedisClientType } from "redis";

@CommandHandler(SaveSSEInstanceCommand)
export class SaveSSEInstanceCommandHandler implements ICommandHandler<SaveSSEInstanceCommand> {
    constructor(
        @Inject('REDIS_CLIENT')
        private readonly redis: RedisClientType
    ) {}

    async execute(command: SaveSSEInstanceCommand): Promise<void> {
        await this.redis.HSET('sse:session:list', `user:${command.userId}`, JSON.stringify(command.session));
    }
}