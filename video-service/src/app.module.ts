import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import awsConfiguration from 'config/aws.configuration';
import databaseConfiguration from 'config/database.configuration';
import { VideoModule } from './video/video.module';
import serviceConfiguration from 'config/service.configuration';
import { AutomapperModule } from '@automapper/nestjs';
import { classes } from '@automapper/classes';
import { NotificationModule } from './notification/notification.module';

@Module({
  imports: [
    AutomapperModule.forRoot({
      strategyInitializer: classes()
    }),
    NotificationModule,
    VideoModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [serviceConfiguration, databaseConfiguration, awsConfiguration]
    }),
  ]
})
export class AppModule {}