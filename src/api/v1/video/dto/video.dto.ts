import { ApiProperty } from "@nestjs/swagger";

export class VideoDto {
    @ApiProperty({
        description: 'video 각각의 id',
        example: '011d8eebc58e0a7d796690800200c9a66'
    })
    videoId: string;
    @ApiProperty({
        description: '해당 video의 추천 갯수',
        example: 3
    })
    likeCount: number;
    @ApiProperty({
        description: '비디오 생성 날짜',
        example: '2022-10-25 오전 7:24'
    })
    createdAt: Date;
}
