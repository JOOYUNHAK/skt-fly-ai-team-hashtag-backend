import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config/dist';
import databaseConfiguration from 'config/database.configuration';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SearchModule } from './search/search.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfiguration]
    }),
    SearchModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
