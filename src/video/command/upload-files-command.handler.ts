import { ICommandHandler, CommandHandler } from "@nestjs/cqrs";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { UploadFilesCommand } from "./upload-files.command";

@CommandHandler(UploadFilesCommand)
export class UploadFilesCommandHandler implements ICommandHandler<UploadFilesCommand> {
    constructor(
        @InjectModel('videos')
        private videoModel: Model<'videos'>
    ) {}

    async execute(command: UploadFilesCommand) {
        const newVideo = new this.videoModel(command);
        await newVideo.save();
    }
}