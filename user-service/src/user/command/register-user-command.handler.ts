import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { RegisterUserCommand } from './regitster-user.command';

@CommandHandler(RegisterUserCommand)
export class RegisterUserCommandHandler implements ICommandHandler<RegisterUserCommand> {
    constructor(
        @Inject('DATA_SOURCE')
        private readonly dataSource: DataSource,
        private readonly eventBus: EventBus
     ) {}
    async execute(command: RegisterUserCommand): Promise<any> {
        const { id, phoneNumber, nickName } = command;
        await this.dataSource.manager.query(
            `INSERT INTO user(id, phone_number, nickname) 
                VALUES(UNHEX(?), ?, ?)`, [id, phoneNumber, nickName]
        );
    }
}