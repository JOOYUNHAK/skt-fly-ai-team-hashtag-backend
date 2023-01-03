import { Module } from "@nestjs/common";
import { TypeOrmModule} from '@nestjs/typeorm';
import { DatabaseModule } from "src/database/database.module";
import { AuthController } from "./auth.controller";
import { AuthService } from './auth.service';
import { User } from "../user/entity/user.entity";
import { UserModule } from "../user/user.module";

@Module ({
    imports: [UserModule],
    controllers: [AuthController],
    providers: [AuthService]
})

export class AuthModule {}