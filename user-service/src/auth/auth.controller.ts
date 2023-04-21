import { Controller, Post, Body, UseInterceptors } from "@nestjs/common";
import { ApiTags, ApiBody, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { LoginResponseDto } from "./dto/login-response.dto";
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { FindUserByPhoneNumberQuery } from "../user/query/find-user-ph.query";
import { GetUserInfoQuery } from "../user/query/get-user-info.query";
import { LoginRequestDto } from "./dto/login-requestdto";
import { RegisterUserCommand } from "../user/command/regitster-user.command";
import { FindByPhoneNumberResult } from "src/user/dto/find-by-ph-result.dto";
import { ResponseTransformInterceptor } from "src/interceptor/transform.interceptor";
import { InjectMapper, MapPipe } from "@automapper/nestjs";
import { Mapper } from "@automapper/core";
import { RegisterUserDto } from "./dto/register-user.dto";

@ApiTags('Auth')
@Controller('auth')
@UseInterceptors(ResponseTransformInterceptor)
export class AuthController {
    constructor(
        private queryBus: QueryBus,
        private commandBus: CommandBus,
        @InjectMapper()
        private mapper: Mapper

    ) { }
    @ApiOperation({
        summary: '로그인',
        description:
            '로그인 유효성 검사가 없으므로 실패에 관한(400번대) status code 없으며 가입한 적 없는 사용자면 입력한 아이디로 바로 회원가입 시킨다'
    })
    @ApiBody({
        type: LoginRequestDto,
        description: '사용자가 입력한 닉네임'
    })
    @ApiBody({
        type: LoginRequestDto,
        description: '사용자가 입력한 휴대폰 번호'
    })
    @ApiResponse({
        status: 200,
        description: '로그인 성공',
        type: LoginResponseDto
    })
    @Post('login')
    async login(@Body(MapPipe(LoginRequestDto, LoginRequestDto)) 
            loginRequestDto: LoginRequestDto): Promise<LoginResponseDto> {

        const findId: FindByPhoneNumberResult =
                await this.queryBus.execute(new FindUserByPhoneNumberQuery(loginRequestDto.getPhoneNumber()))
        
        /* 로그인 성공 */
        if( findId ) 
            return await this.queryBus.execute( new GetUserInfoQuery( findId.id ));     
        
        return this.register(this.mapper.map(loginRequestDto, LoginRequestDto, RegisterUserDto));
    }

    async register(registerUserDto: RegisterUserDto): Promise<LoginResponseDto> {
        /* 회원가입 */
        await this.commandBus.execute(new RegisterUserCommand( 
            registerUserDto.getPhoneNumber(), registerUserDto.getNickName() 
        ));        
        return await this.queryBus.execute(new GetUserInfoQuery( registerUserDto.getNickName() ));
    }
}
