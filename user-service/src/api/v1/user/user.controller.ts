import { HttpService } from "@nestjs/axios";
import { Controller, Get, Param } from "@nestjs/common";
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CommonResponseDto } from "../swagger/dto/common-response.dto";
import { VideoResponseDto } from "../video/dto/video-response.dto";
import { MyFeedDto } from "./dto/my-feed.dto";
import { GetMyFeedResponseDto } from "./dto/response.dto";

@ApiTags('User')
@Controller('user')
export class UserController {
    constructor( private readonly httpService: HttpService ) {}
    @ApiOperation({
        summary: '내 피드 조회',
        description: '내가 업로드 했던 video list 조회'
    })
    @ApiParam({
        name: 'seq',
        example: 1,
        description: '사용자가 로그인에 성공하면 Client에게 넘겨주는 user객체 중 seq',
        required: true
    })
    @ApiResponse({
        status: 200,
        description: '올린 video가 하나라도 있어 list 반환',
        type: VideoResponseDto
    })
    @ApiResponse({
        status: 204,
        description: '올린 video가 하나도 없는 경우',
        type: CommonResponseDto
    })
    @Get('feed/:id')
    async getMyFeed(@Param('id') id: string): Promise<GetMyFeedResponseDto> {
	    console.log(id)
        const { data }:{data: MyFeedDto []} 
            = await this.httpService.axiosRef.get(`http://172.18.10.6:8081/video/image/${id}`);
        return {
            statusCode: 200,
            message: 'OK 내 피드 성공적 조회',
            body: {
                data: [
                    ...data
                ]
            }
        }
    }
}
