export class UploadCompleteVideoCommand {
    constructor(
        public readonly userId: string,
        public readonly title: string
    ) {}
}