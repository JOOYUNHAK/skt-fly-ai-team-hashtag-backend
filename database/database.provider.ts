import { ConfigService } from "@nestjs/config";
import { ConfigModule } from "@nestjs/config/dist";
import { MongoClient } from "mongodb";

export const MongoDbProvider = [
    {
        provide: 'MONGO_CONNECTION',
        import:[ConfigModule],
        inject:[ConfigService],
        useFactory: async(configService: ConfigService) => {
            try {
                const client = await MongoClient.connect(configService.get('MONGODB.URI'), {
                    heartbeatFrequencyMS: configService.get('MONGODB.HEARTBEAT')
                });
                return client.db(configService.get('MONGODB.DATABASE'));
            }   
            catch(err) {
                console.log('MONGODB CONNECTION ERROR IN COMMENT SERVICE....', err);
            }
        }
    }
]