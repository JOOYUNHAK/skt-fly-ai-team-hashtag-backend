import { Module } from "@nestjs/common";
import { DatabaseModule } from "src/database/database.module";
import { UserController } from "./user.controller";
import { userRepository } from "./user.repository";
import { UserService } from './user.service';

@Module({
    imports: [DatabaseModule],
    controllers: [UserController],
    providers: [
        ...userRepository,
        UserService
    ],
    exports: [
        UserService,
        ...userRepository
    ]
})

export class UserModule {}