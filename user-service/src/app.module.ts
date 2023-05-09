import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import databaseConfiguration from 'config/database.configuration';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { AutomapperModule } from '@automapper/nestjs';
import { classes } from '@automapper/classes';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfiguration]
    }),
    AutomapperModule.forRoot({
      strategyInitializer: classes()
    }),
    AuthModule,
    UserModule,
  ],
})
export class AppModule {}
