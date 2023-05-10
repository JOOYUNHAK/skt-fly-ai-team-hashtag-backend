import { Module } from '@nestjs/common';

import { ConfigModule } from "@nestjs/config";
import { CqrsModule } from '@nestjs/cqrs';
import databaseConfiguration from 'config/database.configuration';
import { DatabaseModule } from 'database/database.module';
import { CommentController } from './comment.controller';
import { GetVideoCommentsQueryHandler } from './query/handler/get-video-comments-query.handler';

@Module({
  imports: [
    CqrsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfiguration]
    }),
    DatabaseModule
  ],
  controllers: [CommentController],
  providers: [
    GetVideoCommentsQueryHandler
  ]
})
export class CommentModule {}
