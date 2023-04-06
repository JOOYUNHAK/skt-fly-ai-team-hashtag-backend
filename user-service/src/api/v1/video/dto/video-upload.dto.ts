import { ApiProperty } from "@nestjs/swagger";

export class VideoUploadDto {
    @ApiProperty({
        description: 'upload하는 user의 id',
        example: '8d7fa89df7ds7afsfaf'
    })
    id: string;
    @ApiProperty({
        description: 'upload하는 user의 닉네임',
        example: '흐암'
    })
    nickName: string;
    @ApiProperty({
        description: 'video를 upload 하고 받은 s3 경로',
        example: 'https:// aws~~'
    })
    url: string;
}