import { Controller, Get, Param } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs/dist';

import { GetVideoCommentsQuery } from './query/comment-service.query';

@Controller('video/comment')
export class CommentController {
  constructor( 
    private readonly queryBus: QueryBus 
  ) {}

  @Get('/:videoId')
  async getVideoComments(@Param('videoId') videoId: string) {
    return await this.queryBus.execute(new GetVideoCommentsQuery(videoId));
  }
}
 
