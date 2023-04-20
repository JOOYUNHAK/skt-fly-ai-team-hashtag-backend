import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { CqrsModule } from '@nestjs/cqrs';
import { DatabaseModule } from "src/database/database.module";
import { RegisterUserCommandHandler } from "./command/register-user-command.handler";
import { FindUserByPhoneNumberQueryHandler } from "./query/find-user-ph-query.handler";
import { GetUserInfoQueryHandler } from "./query/get-user-info-query.handler";
import { UserController } from "./user.controller";
import { userRepository } from "./user.repository";

@Module({
    imports: [ 
        DatabaseModule,
        CqrsModule,
        HttpModule.register({
            timeout: 3000,
            maxRedirects: 3
        })
    ],
    controllers: [UserController],
    providers: [
        ...userRepository,
        FindUserByPhoneNumberQueryHandler,
        RegisterUserCommandHandler,
        GetUserInfoQueryHandler
    ],
    exports: [
        ...userRepository,
        CqrsModule
    ]
})

export class UserModule {}