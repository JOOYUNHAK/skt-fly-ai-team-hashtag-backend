import { Controller, Post, Body, Get } from "@nestjs/common";
import { ApiTags, ApiBody, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { LoginResponseDto } from "./login/dto/login-response.dto";
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { FindUserByPhoneNumberQuery } from "../user/query/find-user-ph.query";
import { GetUserInfoQuery } from "../user/query/get-user-info.query";
import { LoginRequestDto } from "./login/dto/login-requestdto";
import { User } from "../user/entity/user.entity";
import { RegisterUserCommand } from "../user/command/regitster-user.command";
import { createResponse } from "../generic/create-response";

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(
        private queryBus: QueryBus,
        private commandBus: CommandBus
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
    async login(@Body() loginRequestDto: LoginRequestDto): Promise<LoginResponseDto> {
        console.log(loginRequestDto)
        const { phoneNumber, nickName } = loginRequestDto;
        const id = await this.queryBus.execute(new FindUserByPhoneNumberQuery(phoneNumber));

        /* 로그인 성공 */
        if (id) {
            // 로그인 성공 이벤트
            const response = await this.queryBus.execute(new GetUserInfoQuery(id.id));
            return createResponse([
                'login', 200, '로그인성공', response
            ])
        }
        return this.register(phoneNumber, nickName);
    }

    async register(phoneNumber:string, nickName: string): Promise<LoginResponseDto> {
        /* 회원가입 */
        const uuid = User.createOrderedUuid();
        await this.commandBus.execute(new RegisterUserCommand(uuid, phoneNumber, nickName));
        const response = await this.queryBus.execute(new GetUserInfoQuery(uuid));
        return createResponse([
            'login', 201, '회원가입 이후 로그인성공', response
        ])
    }
}