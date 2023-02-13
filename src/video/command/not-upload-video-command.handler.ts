import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Inject } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import AmazonS3URI from "amazon-s3-uri";
import { RedisClientType } from "redis";
import { NotUploadVideoCommand } from "./not-upload-video.command";

@CommandHandler(NotUploadVideoCommand)
export class NotUploadVideoCommandHandler implements ICommandHandler<NotUploadVideoCommand> {
    constructor(
        @Inject('REDIS_CLIENT')
        private readonly redis: RedisClientType,
        @Inject('S3_CLIENT')
        private readonly s3Client: S3Client,
        private readonly configService: ConfigService
    ) {}

    async execute(command: NotUploadVideoCommand): Promise<any> {
        const { userId } = command;
        const field = `user:${userId}`;
        const { thumbNailPath, videoPath, originVideoPath } = JSON.parse( await this.redis.HGET('process:video:list', field) );
        await this.redis.HDEL('process:video:list', `user:${userId}`);
        const BUCKET = this.configService.get('AWS.S3.BUCKET');

        const { key: thumbNailKey } = AmazonS3URI(thumbNailPath);
        const { key: videoKey } = AmazonS3URI(videoPath);
        const { key: originKey } = AmazonS3URI(originVideoPath);

        const thumbNailBucketParams = { 
            Bucket: BUCKET,
            Key: thumbNailKey
         };
        const videoBucketParams = {
            Bucket: BUCKET,
            Key: videoKey
        };
        const originBucketParams = {
            Bucket: BUCKET,
            Key: originKey
        };

        try {
            await Promise.all([
                this.s3Client.send(new DeleteObjectCommand(thumbNailBucketParams)),
                this.s3Client.send(new DeleteObjectCommand(videoBucketParams)),
                this.s3Client.send(new DeleteObjectCommand(originBucketParams))
            ]);
        }
        catch(err) {
            console.log('delete bucket error in NotUploadVideoCommand....', err);
        }
    }
}