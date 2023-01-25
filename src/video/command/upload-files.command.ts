export class UploadFilesCommand {
    constructor(
        readonly owner: string,
        readonly videoPath: string,
        readonly thumbNailPath: string
    ) {}
}