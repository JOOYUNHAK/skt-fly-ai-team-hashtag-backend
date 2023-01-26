import { Body, Controller, Patch } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CommonResponseDto } from "../swagger/dto/common-response.dto";
import { LikeRequestDto } from "./dto/like.request.dto";

@ApiTags('Like')
@Controller('like')
export class LikeController {
    @ApiOperation({
        summary: '추천',
        description: '각 video 중 마음에 드는 video 추천'
    })
    @ApiBody({
        type: LikeRequestDto,
        description: '추천을 누른 사용자의 id, video의 id'
    })
    @ApiResponse({
        status: 201,
        description: '처음 추천한 사용자가 추천 완료하여 추천 수 1증가',
        type: CommonResponseDto
    })
    @ApiResponse({
        status: 200,
        description: '해당 video에 대해 추천했던 사용자가 추천하여 추천 수 1감소',
        type: CommonResponseDto
    })
    @Patch()
    pushLike(@Body() likeRequestDto: LikeRequestDto) {

    }
}