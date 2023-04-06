import { ConfigModule } from "@nestjs/config";
import { ConfigService } from "@nestjs/config/dist";
import { MongoClient } from "mongodb";

/* MongoDb Connection */
export const MongoProvider = [
    {
        provide: 'MONGO_CONNECTION', // Token
        import: [ConfigModule],
        inject: [ConfigService],
        useFactory: async (configService: ConfigService) => {
            try {
                const client = await MongoClient.connect(configService.get('mongodb.uri'), {
                    heartbeatFrequencyMS: configService.get('mongodb.heartbeat')
                });
                return client.db(configService.get('mongodb.database'))
            }   
            catch(err) {
                console.log('Mongo connection error....', err)
            }
        }
    }
]