import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ApiGateway } from './app.controller';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    HttpModule,
    EventEmitterModule.forRoot()
  ],
  controllers: [ApiGateway],
  providers: [],
})

export class AppModule {}
