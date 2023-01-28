import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LikeModule } from './like/like.module';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [
    LikeModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
