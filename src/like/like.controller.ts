import { Body, Controller, Put } from '@nestjs/common';
import { QueryBus, CommandBus } from '@nestjs/cqrs';
import { AddLikeCommand } from './command/add-like.command';
import { CancelLikeCommand } from './command/cancel-like.command';
import { PushLikeDto } from './dto/push-like.dto';
import { IsLikedVideoQuery } from './query/is-liked-video.query';

@Controller('like')
export class LikeController {
    constructor( 
        private readonly queryBus: QueryBus,
        private readonly commandBus: CommandBus
    ) {}

    /* 좋아요 눌렀을 때 */
    @Put()
    async pushLike(@Body() pushLikeDto: PushLikeDto) {
        const { userId, videoId }= pushLikeDto;
        if( !await this.queryBus.execute( new IsLikedVideoQuery(userId, videoId)) ) 
            await this.commandBus.execute( new AddLikeCommand(userId, videoId) );
        else
            await this.commandBus.execute( new CancelLikeCommand(userId, videoId) );
    } 
}