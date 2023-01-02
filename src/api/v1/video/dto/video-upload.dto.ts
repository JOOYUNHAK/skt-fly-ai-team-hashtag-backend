import { ApiProperty } from "@nestjs/swagger";

export class VideoUploadDto {
    @ApiProperty({
        description: 'video를 업로드하는 사용자의 seq 번호',
        example: 2
    })
    seq: number;
}