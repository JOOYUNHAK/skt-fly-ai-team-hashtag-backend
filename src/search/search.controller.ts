import { Controller, Get, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs/dist';
import { SearchVideoQuery } from './query/search-video.query';

@Controller('search')
export class SearchController {
    constructor(
        private readonly queryBus: QueryBus
    ) {}
    @Get('video')
    async searchVideo(@Query('keyword') keyword: string) {
        return this.queryBus.execute(new SearchVideoQuery(keyword));
    }
}