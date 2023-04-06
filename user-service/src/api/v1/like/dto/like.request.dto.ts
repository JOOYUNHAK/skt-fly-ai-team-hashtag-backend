import { ApiProperty } from "@nestjs/swagger";

export class LikeRequestDto {
    @ApiProperty({
        type: 'string',
        description: '사용자가 로그인에 성공하면 Client에게 넘겨주는 user객체 중 id',
        example: '011d8eebc58e0a7d796690800200c9a66'
    })
    userId: string;
    @ApiProperty({
        type: 'string',
        description: '해당 비디오의 id',
        example: '011d8eebc58e0a7d796690800200c9a66'
    })
    videoId: string;
}