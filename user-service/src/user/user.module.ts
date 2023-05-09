import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { CqrsModule } from '@nestjs/cqrs';
import { UserController } from "./interface/user.controller";
import { userProvider } from "./infra/database/user.provider";
import { UserRepository } from "./infra/database/user.repository";
import { UserService } from "./application/user.service";
import { UserProfile } from "./interface/mapper/user.profile";
import { MysqlModule } from "src/mysql/mysql.module";

@Module({
    imports: [ 
        MysqlModule,
        CqrsModule,
        HttpModule.register({
            timeout: 3000,
            maxRedirects: 3
        })
    ],
    controllers: [UserController],
    providers: [
        ...userProvider,
        UserProfile,
        UserService,
        UserRepository,
    ],
    exports: [
        UserProfile,
        UserService,
        UserRepository,
    ]
})

export class UserModule {}