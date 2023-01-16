export class UploadFilesCommand {
    constructor(
        readonly id: string,
        readonly videoPath: string,
        readonly thumbNailPath: string
    ) {}
}