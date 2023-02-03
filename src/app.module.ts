import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import databaseConfiguration from 'config/database.configuration';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LikeModule } from './like/like.module';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [
    LikeModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfiguration]
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
