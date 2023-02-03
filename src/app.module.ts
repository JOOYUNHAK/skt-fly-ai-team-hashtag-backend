import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ApiGateway } from './app.controller';

@Module({
  imports: [
    HttpModule.register({
      timeout: 3000,
      maxRedirects: 3
    })
  ],
  controllers: [ApiGateway],
  providers: [],
})

export class AppModule {}
