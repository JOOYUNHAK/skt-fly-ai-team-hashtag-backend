import { NestFactory } from '@nestjs/core';
import { WinstonModule } from 'nest-winston';
import { AppModule } from './app.module';
import * as WinstonFile from 'winston-daily-rotate-file';
import * as winston from 'winston';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      format: winston.format.combine(
        winston.format.timestamp({ 
          format: 'YYYY:MM:DD HH:mm:ss'
        }),
        winston.format.json(),
        winston.format.printf( info => `${info.timestamp} ${info.level}: ${info.message}`)
      ),
      transports: [
        /* log to file */
        new WinstonFile({
          level: 'http',
          filename: '%DATE%.log',
          dirname: 'C:\\Users\\user\\adot-video-project',
          datePattern: 'YYYY-MM-DD',
          format: winston.format.combine(
            winston.format.json(),
            winston.format.timestamp({
              format: 'YYYY:MM:DD HH:mm:ss'
            })
          ),
          options: { flags: 'a+' },
          maxFiles: '1d'
        }),

        /* log to console */
        new winston.transports.Console({
          level: 'debug',
          format: winston.format.combine(
            winston.format.timestamp({
              format: 'YYYY-MM-DD HH:mm:ss.SSS',
            }),
            winston.format.printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)
          )
        })
      ]
    })
  });
  await app.listen(8000);
}
bootstrap();
