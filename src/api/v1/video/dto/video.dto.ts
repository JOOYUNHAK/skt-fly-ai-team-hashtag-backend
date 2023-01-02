import { ApiProperty } from "@nestjs/swagger";

export class VideoDto {
    @ApiProperty({
        description: 'video id(DB에서 AUTO_INCREMENT 값)',
        example: 1
    })
    videoId: number;
    @ApiProperty({
        description: '비디오 생성 날짜',
        example: '2022-10-25 오전 7:24'
    })
    createdAt: Date;
    @ApiProperty({
        description: '해당 video의 추천 갯수',
        example: 3
    })
    likeCount: number
}
