import { ApiProperty } from "@nestjs/swagger";

export class UserDto {
    @ApiProperty({
        example: 1,
        description: '해당 사용자에 해당되는 AUTO_INCREMENT ID'
    })
    seq: number;
    @ApiProperty({
        example: '01024893797',
        description: '해당 사용자의 핸드폰 번호'
    })
    id: string;
    @ApiProperty({
        example: '해시태그',
        description: '해당 사용자의 닉네임'
    })
    nickName: string;
}