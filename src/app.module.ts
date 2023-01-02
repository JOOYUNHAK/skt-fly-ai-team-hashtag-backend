import { Module } from '@nestjs/common';
import { AuthModule } from './api/v1/auth/auth.module';
import { LikeModule } from './api/v1/like/like.module';
import { SearchModule } from './api/v1/search/search.module';
import { UserModule } from './api/v1/user/user.module';
import { VideoModule } from './api/v1/video/video.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    AuthModule,
    SearchModule,
    LikeModule,
    UserModule,
    VideoModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
