import { ConfigModule, ConfigService } from "@nestjs/config"
import { MongoClient } from "mongodb";

export const databaseProviders = [
    {
        provide: 'MONGO_CONNECTION',
        import: [ConfigModule],
        inject: [ConfigService],
        useFactory: async(configService: ConfigService) => {
            try{
                const client = await MongoClient.connect(configService.get('mongodb.uri'), { 
                    heartbeatFrequencyMS: configService.get('mongodb.heartbeat'),
                });
                return client.db(configService.get('mongodb.database'));
            }
            catch(err) {
                throw err;
            }
        }
    }
]