import { ApiProperty } from "@nestjs/swagger";

export class MainPageVideoDto {
    @ApiProperty({
        description: 'video 각각의 id',
        example: '011d8eebc58e0a7d796690800200c9a66'
    })
    videoId: string;
    @ApiProperty({
        description: '해당 video의 thumbNail path',
        example: 'https:~~aws'
    })
    thumbNailPath: string;
    @ApiProperty({
        description: '해당 video를 올린 사용자의 닉네임',
        example: 'pain'
    })
    nickName: string;
    @ApiProperty({
        description: '해당 video의 제목',
        example: '흐암'
    })
    title: string;
    @ApiProperty({
        description: '해당 video의 태그',
        example: ['1', '2', '3']
    })
    tags: string[];
    @ApiProperty({
        description: '해당 video의 추천 갯수',
        example: 3
    })
    likeCount: number;
    @ApiProperty({
        description: '업로드 날짜와 현재 시간 차이 (ms)',
        example: '243433'
    })
    uploadedAt: number;
}
