import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ApiGateway } from './app.controller';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ConfigModule } from '@nestjs/config';
import apiGatewayConfiguration from 'config/api-gateway.configuration';

@Module({
  imports: [
    HttpModule.register({
      maxRedirects: 3,
      timeout: 1000
    }),
    EventEmitterModule.forRoot(),
    ConfigModule.forRoot({
      load: [apiGatewayConfiguration]
    })
  ],
  controllers: [ApiGateway],
  providers: [],
})

export class AppModule {}
