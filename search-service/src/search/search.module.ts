import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { DatabaseModule } from '../../src/database/database.module';
import { SearchVideoQueryHandler } from './query/search-video-query.handler';
import { SearchController } from './search.controller';

@Module({
    imports: [
        DatabaseModule,
        CqrsModule
    ],
    providers: [
        SearchVideoQueryHandler
    ],
    controllers: [SearchController]
})

export class SearchModule {}