import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { Db } from 'mongodb';
import { SearchVideoQuery } from './search-video.query';
import { SearchVideoPipeline } from '../pipeline/search.pipeline';

@QueryHandler(SearchVideoQuery)
export class SearchVideoQueryHandler implements IQueryHandler<SearchVideoQuery>{
    constructor(
        @Inject('MONGO_CONNECTION')
        private readonly db: Db
    ) {}

    async execute(query: SearchVideoQuery): Promise<any> {
        const { keyword } = query;
        return await this.db
            .collection('video')
            .aggregate(SearchVideoPipeline(keyword))
            .toArray(); 
    }
}