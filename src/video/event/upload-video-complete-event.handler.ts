import { DeleteObjectCommand, S3, S3Client } from "@aws-sdk/client-s3";
import { Inject } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import AmazonS3URI from "amazon-s3-uri";
import { UploadVideoCompleteEvent } from "./upload-video-complete.event";

@EventsHandler(UploadVideoCompleteEvent)
export class UploadVideoCompleteEventHandler implements IEventHandler<UploadVideoCompleteEvent> {
    constructor( 
        @Inject('S3_CLIENT')
        private readonly s3Client: S3Client,
        private readonly configService: ConfigService
    ) {}
    
    async handle(event: UploadVideoCompleteEvent) {
        const { originVideoPath } = event;
        const { key } = AmazonS3URI(originVideoPath);
        const BUCKET = this.configService.get('AWS.S3.BUCKET');
        const deleteBucketParam = { Bucket: BUCKET, Key: key };
        try {
            await this.s3Client.send(new DeleteObjectCommand(deleteBucketParam));
        }
        catch(err) {
            console.log('delete bucket error in UploadVideoCompleteEvent...', err);
        }
    }
}