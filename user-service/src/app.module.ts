import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import databaseConfiguration from 'config/database.configuration';
import { AuthModule } from './auth/auth.module';
import { LikeModule } from './api/v1/like/like.module';
import { SearchModule } from './api/v1/search/search.module';
import { VideoModule } from './api/v1/video/video.module';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';


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
})
export class AppModule {}
