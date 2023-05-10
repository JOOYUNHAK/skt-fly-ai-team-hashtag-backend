import { InjectMapper, MapPipe } from "@automapper/nestjs";
import { Body, Controller, Post } from "@nestjs/common";
import { LoginRequestDto } from "./dto/login-requestdto";
import { LoginRequest } from "../domain/login-request";
import { User } from "src/user/domain/entity/user.entity";
import { AuthService } from "../application/auth.service";
import { Mapper } from "@automapper/core";
import { UserDto } from "src/user/interface/dto/user.dto";

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        @InjectMapper()
        private readonly mapper: Mapper
    ) {}
    @Post('login')
    async login(@Body(MapPipe(LoginRequestDto, LoginRequest)) loginRequest: LoginRequest): Promise<UserDto> {
        const user = await this.authService.login(loginRequest);
        return this.mapper.map(user, User, UserDto);
    }
}