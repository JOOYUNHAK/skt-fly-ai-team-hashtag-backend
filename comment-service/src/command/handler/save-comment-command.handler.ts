import { Inject } from "@nestjs/common";
import { ICommandHandler, CommandHandler } from "@nestjs/cqrs";
import { Db } from 'mongodb';
import { SaveCommentCommand } from "../comment-service.command";

@CommandHandler(SaveCommentCommand)
export class SaveCommentCommandHandler implements ICommandHandler<SaveCommentCommand> {
    constructor( 
        @Inject('MONGO_CONNECTION') 
        private readonly mongoDb: Db 
        ) {}
    async execute(command: SaveCommentCommand): Promise<any> {
        await this.mongoDb
            .collection('comment')
            .insertOne({ ...command, uploadedAt: Date.now() })
    }
}