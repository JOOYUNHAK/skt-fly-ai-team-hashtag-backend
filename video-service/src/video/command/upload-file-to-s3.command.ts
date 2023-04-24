import { ICommand } from "@nestjs/cqrs";
import * as fs from 'node:fs';

export class UploadFileToS3Command implements ICommand {
    constructor(
        readonly videoPath: string,
        readonly thumbNailPath: string,
        readonly videoStream: fs.ReadStream,
        readonly thumbNailStream: fs.ReadStream
    ) {}
}