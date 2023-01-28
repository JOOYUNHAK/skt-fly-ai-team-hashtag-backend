import { Injectable } from '@nestjs/common';
import { createResponse } from '../generic/create-response';
import { UserService } from '../user/user.service';
import { LoginRequestDto } from './login/dto/login-requestdto';
import { LoginResponseDto } from './login/dto/login-response.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService
    ) { }
    /* 사용자 로그인 */
    async login(loginDto: LoginRequestDto): Promise<LoginResponseDto> {
        const user = await this.userService.findUser(loginDto.phoneNumber);
        // 회원가입이 되어 있는 사용자라면 바로 사용자 정보 반환
        if (user) {
            return createResponse([
                'login', 200, '기존 사용자 로그인', {
                    ...user,
                    ...loginDto
                }]);
        }
        return this.userService.registerUser(loginDto);
    }
}
