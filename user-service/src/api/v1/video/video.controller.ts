import { Controller, Get, Post } from "@nestjs/common";
import { ApiBody, ApiHeader, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CommonResponseDto } from "../swagger/dto/common-response.dto";
import { VideoResponseDto } from "./dto/video-response.dto";
import { VideoStreamingResponseDto } from "./dto/video-streaming-response.dto";
import { VideoUploadDto } from "./dto/video-upload.dto";

@ApiTags('Video')
@Controller('video')
export class VideoController {
    @ApiOperation({
        summary: '메인페이지 video list 조회',
        description: '사용자가 메인 페이지로 이동하면 최신 동영상과 인기 동영상을 노출'
    })
    @ApiQuery({
        description: 
            'https://localhost:8900/api/v1/video',
    })
    @ApiResponse({
        status: 200,
        description: 'video list 반환',
        type: VideoResponseDto
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
        status: 200,
        description: '정상적으로 video가 재생됨',
        type: VideoStreamingResponseDto
    })
    @Get('stream/:id')
    async streamVideo() {

    }
}