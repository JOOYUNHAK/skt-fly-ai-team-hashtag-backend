import { Controller, Post, Body, Get } from "@nestjs/common";
import { ApiTags, ApiBody, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { AuthService } from "./auth.service";
import { LoginResponseDto } from "./dto/login-response.dto";
import { LoginDto } from "./dto/login.dto";

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService
    ) {}
    @ApiOperation({
        summary: '로그인',
        description: 
            '로그인 유효성 검사가 없으므로 실패에 관한(400번대) status code 없으며 가입한 적 없는 사용자면 입력한 아이디로 바로 회원가입 시킨다'
    })
    @ApiBody({ 
        type: LoginDto,
        description: '사용자가 입력한 닉네임'           
    })
    @ApiBody({ 
        type: LoginDto,
        description: '사용자가 입력한 휴대폰 번호'           
    })
    @ApiResponse({
        status: 200,
        description: '로그인 성공',
        type: LoginResponseDto
    })
    @Post('login')
    async login(@Body() loginDto: LoginDto): Promise<any> {
        return await this.authService.login(loginDto);
    }
    
}