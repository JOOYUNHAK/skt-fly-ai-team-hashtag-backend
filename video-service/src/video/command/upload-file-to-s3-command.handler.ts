import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UploadFileToS3Command } from "./upload-file-to-s3.command";
import { Inject } from "@nestjs/common";
import { S3Service } from "src/aws/s3/s3.service";
import { ConfigService } from "@nestjs/config";

@CommandHandler(UploadFileToS3Command)
export class UploadFileToS3CommandHandler implements ICommandHandler<UploadFileToS3Command> {
    private readonly bucket: string;
    
    constructor( 
        private readonly s3Service: S3Service,
        private readonly configService: ConfigService,
    ) {
        this.bucket = this.configService.get('AWS.S3.BUCKET');
    }

    async execute(command: UploadFileToS3Command): Promise<any> { 
        const {videoPath, thumbNailPath, videoStream, thumbNailStream } = command;
        // s3 key 구하기
        const [videoKey, thumbNailKey] = 
            [ this.s3Service.getKey('video', videoPath), this.s3Service.getKey('image', thumbNailPath) ];
        // s3 PutObjectCommandInput
        const [videoPutCommand, thumbNailPutCommand] = [
                this.s3Service.createPutObjectCommand(this.bucket, videoKey, videoStream), 
                this.s3Service.createPutObjectCommand(this.bucket, thumbNailKey, thumbNailStream)
            ];
        // s3 upload
        await this.s3Service.pubObjects([videoPutCommand, thumbNailPutCommand])
    }
}