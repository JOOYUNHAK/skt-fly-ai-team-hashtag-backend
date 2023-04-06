import { Inject } from "@nestjs/common";
import { ICommandHandler, CommandHandler } from "@nestjs/cqrs";
import { Db } from 'mongodb';
import { UploadFilesCommand } from "./upload-files.command";

@CommandHandler(UploadFilesCommand)
export class UploadFilesCommandHandler implements ICommandHandler<UploadFilesCommand> {
    constructor(
        @Inject('MONGO_CONNECTION')
        private db: Db
    ) { }

    async execute(command: UploadFilesCommand) {
        await this.db
            .collection('videos')
            .insertOne({
                ...command,
                uploadedAt: Date.now()
            });
    }
}