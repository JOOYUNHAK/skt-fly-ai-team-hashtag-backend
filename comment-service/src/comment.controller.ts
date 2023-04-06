import { Body, Controller, Post, Get, Param } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs/dist';
import { SaveCommentCommand } from './command/comment-service.command';
import { SaveCommentDto } from './dto/comment-service.dto';
import { GetVideoCommentsQuery } from './query/comment-service.query';

@Controller('video/comment')
export class CommentController {
  constructor( 
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus 
  ) {}

  @Post()
  async saveComment(@Body() saveCommentDto: SaveCommentDto) {
    const { videoId, userId, nickName, content } = saveCommentDto;
    console.log('save comment request....');
    await this.commandBus.execute(new SaveCommentCommand(videoId, userId, nickName, content)); 
  }

  @Get('/:videoId')
  async getVideoComments(@Param('videoId') videoId: string) {
    return await this.queryBus.execute(new GetVideoCommentsQuery(videoId));
  }
}
 
