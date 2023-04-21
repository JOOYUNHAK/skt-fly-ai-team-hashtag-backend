import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { UserModule } from "../user/user.module";
import { HttpModule } from "@nestjs/axios/dist";
import { AuthProfile } from "src/mapper/auth.profile";

@Module ({
    imports: [
        UserModule,
        HttpModule.register({
            timeout: 3000,
            maxRedirects: 3
        }) 
    ],
    controllers: [AuthController],
    providers: [AuthProfile]
})

export class AuthModule {}