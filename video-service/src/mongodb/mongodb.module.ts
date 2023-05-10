import { Module } from "@nestjs/common";
import { mongodbProviders } from "./mongodb.providers";

@Module({
    providers: [...mongodbProviders],
    exports: [...mongodbProviders]
})
export class MongodbModule {}