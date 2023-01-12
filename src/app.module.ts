import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import videoConfiguration from 'config/video.configuration';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VideoModule } from './video/video.module';

@Module({
  imports: [
    VideoModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [videoConfiguration]
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
