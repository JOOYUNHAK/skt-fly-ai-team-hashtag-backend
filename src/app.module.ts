import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import awsConfiguration from 'config/aws.configuration';
import databaseConfiguration from 'config/database.configuration';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { VideoModule } from './video/video.module';

@Module({
  imports: [
    VideoModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfiguration, awsConfiguration]
    }),
    DatabaseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}