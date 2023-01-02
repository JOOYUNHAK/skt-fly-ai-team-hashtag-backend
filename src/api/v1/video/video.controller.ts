import { Controller, Get, Post } from "@nestjs/common";
import { ApiBody, ApiHeader, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CommonResponseDto } from "../swagger/dto/common-response.dto";
import { VideoResponseDto } from "./dto/video-response.dto";
import { VideoUploadDto } from "./dto/video-upload.dto";

@ApiTags('Video')
@Controller('video')
export class VideoController {
    @ApiOperation({
        summary: '메인페이지 video list 조회',
        description: '사용자가 메인 페이지로 이동하면 각각 filter를 hot(인기 급상승)과 latest(최신)로 2번의 요청을 보내야 함'
    })
    @ApiQuery({
        name: 'filter',
        example: 'hot',
        description: 
            'http://localhost:8080/video?filter=hot, http://localhost:8080/video?filter=latest ',
        required: true
    })
    @ApiResponse({
        status: 200,
        description: '각 filter에 맞는 video list 반환',
        type: VideoResponseDto
    })
    @ApiResponse({
        status: 204,
        description: 
            '만약 hot video가 없는 경우 hot video list에 대한 조회 요청에는 204 코드가 반환되고, Client는 해당 코드에 대해서는 `영상이 준비중이에요`와 같은 문구를 노출시키면 됨',
        type: CommonResponseDto
    })
    @Get()
    async getMainVideos() {

    }

    @ApiOperation({
        summary: 'video 업로드',
        description: '요약된 video를 사용자가 업로드 하는 경우'
    })
    @ApiBody({
        type: VideoUploadDto,
        description: 'video를 업로드하는 사용자의 seq번호',
    })
    @ApiResponse({
        status: 201,
        description: '정상적으로 파일이 저장됨',
        type: CommonResponseDto
    })
    @Post()
    async uploadVideo() {

    }

    @ApiOperation({
        summary: 'video 재생',
        description: '특정 video 재생'
    })
    @ApiHeader({
        name: 'Accept-Ranges',
        description: 'byte 사이즈'
    })
    @ApiHeader({
        name: 'Content-Type',
        description: 'video/mp4'
    })
    @ApiParam({
        name: 'id',
        description: '각 video가 가지고 있는 고유 id',
        example: 2,
        type: Number
    })
    @ApiResponse({
        status: 206,
        description: '정상적으로 video가 재생됨',
        type: CommonResponseDto
    })
    @Get('stream/:id')
    async streamVideo() {

    }
}