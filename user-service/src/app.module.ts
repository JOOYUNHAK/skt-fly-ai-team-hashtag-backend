import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import databaseConfiguration from 'config/database.configuration';
import { AuthModule } from './api/v1/auth/auth.module';
import { AuthService } from './api/v1/auth/auth.service';
import { LikeModule } from './api/v1/like/like.module';
import { SearchModule } from './api/v1/search/search.module';
import { UserModule } from './api/v1/user/user.module';
import { VideoModule } from './api/v1/video/video.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfiguration]
    }),
    AuthModule,
    SearchModule,
    LikeModule,
    UserModule,
    VideoModule,
    DatabaseModule
  ],
  controllers: [AppController],
  providers: [AppService, AuthService],
})
export class AppModule {}
