import { Controller, Get, Query } from "@nestjs/common";
import { SearchKeywordDto } from "./dto/search-keyword.dto";
import { ApiTags, ApiQuery, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { CommonResponseDto } from "../swagger/dto/common-response.dto";
import { VideoResponseDto } from "../video/dto/video-response.dto";

@ApiTags('Search')
@Controller('search')
export class SearchController {
    @ApiOperation({ 
        summary: '해시태그 검색', 
        description: '검색한 해시태그에 맞는 video list 요청'
    })
    @ApiQuery({
        name: 'keyword',
        description: '사용자가 입력한 키워드',
        example: '스키장',
        required: true
    })
    @ApiResponse({
        status: 200,
        description: '한 개라도 검색 결과에 만족하는 video가 있으면 video list 반환',
        type: VideoResponseDto
    })
    @ApiResponse({
        status: 204,
        description: '정상적으로 요청되었으나 검색 결과에 맞는 video list가 없음',
        type: CommonResponseDto
    })
    @Get()
    async getSearchResult(@Query() keywords: SearchKeywordDto): Promise<any> {
        return ''
    }
}