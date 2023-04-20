import { HttpService } from "@nestjs/axios";
import { Controller, Get, Param, UseInterceptors } from "@nestjs/common";
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CommonResponseDto } from "../api/v1/swagger/dto/common-response.dto";
import { VideoResponseDto } from "../api/v1/video/dto/video-response.dto";
import { Observable, map } from "rxjs";
import { AxiosResponse } from "axios";
import { ResponseTransformInterceptor } from "../interceptor/transform.interceptor";
import { MyFeedResponseDto } from "./dto/my-feed-response.dto";

@ApiTags('User')
@Controller('user')
@UseInterceptors(ResponseTransformInterceptor)
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
    getMyFeed(@Param('id') id: string): Observable<AxiosResponse<MyFeedResponseDto []>> {
        return this.httpService
                .get(`http://127.0.0.1:8081/video/image/${id}`)
                .pipe( map(response => response.data) );
    }
}
