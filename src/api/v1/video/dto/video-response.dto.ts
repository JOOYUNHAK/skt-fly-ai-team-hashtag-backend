import { ApiProperty } from "@nestjs/swagger";
import { CommonResponseDto } from "../../swagger/dto/common-response.dto";
import { MainPageVideoDto } from "./main-page-video.dto";
import { VideoDto } from "./video.dto";

class VideoResponseData{
    @ApiProperty({
        type: [MainPageVideoDto],
    })
    video: MainPageVideoDto
}

export class VideoResponseDto extends CommonResponseDto{
    @ApiProperty()
    body: VideoResponseData
}