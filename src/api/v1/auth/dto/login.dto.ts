import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
    @ApiProperty({
        description: '사용자가 입력한 휴대폰번호',
        example: '01024893797'
    })
    phoneNumber: string    
}