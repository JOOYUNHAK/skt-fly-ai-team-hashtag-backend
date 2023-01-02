import { ApiProperty } from "@nestjs/swagger";

export class LikeRequestDto {
    @ApiProperty({
        type: 'number',
        description: '사용자가 로그인에 성공하면 Client에게 넘겨주는 user객체 중 seq',
        example: 1
    })
    userSeq: number;
    @ApiProperty({
        type: 'number',
        description: '해당 비디오의 id',
        example: 1
    })
    videoId: number;
}