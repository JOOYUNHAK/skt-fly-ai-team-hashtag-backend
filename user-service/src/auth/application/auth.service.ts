import { Injectable } from "@nestjs/common";
import { UserService } from "src/user/application/user.service";
import { LoginRequest } from "../domain/login-request";
import { User } from "src/user/domain/entity/user.entity";

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService
    ) {}

    async login(loginRequest: LoginRequest): Promise<User> {
        const user = await this.userService.findUserByPhoneNumber(loginRequest.phoneNumber);
        /* 가입안된 사용자면 바로 가입 */
        if( !user ) return await this.userService.register(loginRequest);
        return user;
    }
}