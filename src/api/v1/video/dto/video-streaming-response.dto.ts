import { ApiProperty } from "@nestjs/swagger";
import { CommonResponseDto } from "../../swagger/dto/common-response.dto";

export class VideoStreamingResponseDto extends CommonResponseDto {
    @ApiProperty({
        description: 'video가 s3에 저장되어 있는 경로',
        example: 'htts: aws~~'
    })
    videoPath: string;
}