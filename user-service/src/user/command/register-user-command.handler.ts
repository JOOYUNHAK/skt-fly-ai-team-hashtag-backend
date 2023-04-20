import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { RegisterUserCommand } from './regitster-user.command';
import { User } from '../entity/user.entity';

@CommandHandler(RegisterUserCommand)
export class RegisterUserCommandHandler implements ICommandHandler<RegisterUserCommand> {
    constructor(
        @Inject('DATA_SOURCE')
        private readonly dataSource: DataSource,
     ) {}
    async execute(command: RegisterUserCommand): Promise<any> {
        await this.dataSource.manager.query(
            `INSERT INTO user(id, phone_number, nickname) 
                VALUES(UNHEX(?), ?, ?)`, [User.createOrderedUuid(), command.phoneNumber, command.nickName]
        );
    }
}