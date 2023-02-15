import { Module } from "@nestjs/common";
import { MongoDbProvider } from "./database.provider";

@Module({
    providers: [...MongoDbProvider],
    exports: [...MongoDbProvider]
}) export class DatabaseModule {}