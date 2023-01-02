import { ApiProperty } from "@nestjs/swagger";
import { CommonResponseDto } from "../../swagger/dto/common-response.dto";
import { VideoDto } from "./video.dto";

class VideoResponseData{
    @ApiProperty({
        type: [VideoDto],
    })
    video: VideoDto[]
}

export class VideoResponseDto extends CommonResponseDto{
    @ApiProperty()
    body: VideoResponseData
}