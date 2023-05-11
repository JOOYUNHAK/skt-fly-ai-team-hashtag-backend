import { Controller, Get, Param } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { GetLikeListQuery } from './query/get-like-list.query';

@Controller('like')
export class LikeController {
    constructor( 
        private readonly queryBus: QueryBus,
    ) {}

    /* 로그인에 성공 시 해당 사용자의 좋아요 목록 요청 */
    @Get('list/:id')
    async getLikeList(@Param('id')id: string) {
        return await this.queryBus.execute(new GetLikeListQuery(id) );
    }
}