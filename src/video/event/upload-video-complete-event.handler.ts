import { DeleteObjectCommand, S3, S3Client } from "@aws-sdk/client-s3";
import { Inject } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import AmazonS3URI from "amazon-s3-uri";
import { UploadVideoCompleteEvent } from "./upload-video-complete.event";
import { unlink } from 'node:fs';

@EventsHandler(UploadVideoCompleteEvent)
export class UploadVideoCompleteEventHandler implements IEventHandler<UploadVideoCompleteEvent> {
    constructor( 
        @Inject('S3_CLIENT')
        private readonly s3Client: S3Client,
        private readonly configService: ConfigService,
        private originVideoPaths: { Bucket: string, Key: string } [] // delete command array
    ) {}
    
    async handle(event: UploadVideoCompleteEvent) {
        const BUCKET = this.configService.get('AWS.S3.BUCKET');
        const { thumbNailPath, videoPath, originVideoPath } = event;
        originVideoPath.map((path) => {
            const { key } = AmazonS3URI(path);
            this.originVideoPaths.push({ Bucket: BUCKET, Key: key })
        })
        try {
            await Promise.all(
                this.originVideoPaths.map((path, index) => {
                    if( index <= 1 ) {
                        const { Key } = path;
                        unlink(`/home/ubuntu/${Key}`, (err) => console.log(
                            'unlink error in uploadVideoCompleteEvent...', err
                        ));
                    }
                    this.s3Client.send( new DeleteObjectCommand(path))
                })
            )
        }
        catch(err) {
            console.log('delete bucket error in UploadVideoCompleteEvent...', err);
        }
    }
}