import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Inject } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import AmazonS3URI from "amazon-s3-uri";
import { RedisClientType } from "redis";
import { NotUploadVideoCommand } from "./not-upload-video.command";
import { unlink } from 'node:fs';
@CommandHandler(NotUploadVideoCommand)
export class NotUploadVideoCommandHandler implements ICommandHandler<NotUploadVideoCommand> {
    constructor(
        @Inject('REDIS_CLIENT')
        private readonly redis: RedisClientType,
        @Inject('S3_CLIENT')
        private readonly s3Client: S3Client,
        private readonly configService: ConfigService,
        private deleteCommandArray: { Bucket: string, Key: string }[]
    ) {}

    async execute(command: NotUploadVideoCommand): Promise<any> {
        const { userId } = command;
        const field = `user:${userId}`;
        const BUCKET = this.configService.get('AWS.S3.BUCKET');
        const { thumbNailPath, videoPath, originVideoPath } = JSON.parse( await this.redis.HGET('process:video:list', field) );
        await this.redis.HDEL('process:video:list', `user:${userId}`);
        const pathArray: string[] = [ thumbNailPath, videoPath, ...originVideoPath ]; // 삭제하려는 경로들 배열로

        /* 각 경로 별 delete command array에 추가 */
        pathArray.map((path) => {
            const { key } = AmazonS3URI(path);
            this.deleteCommandArray.push({ Bucket: BUCKET, Key: key});
        });
        try {
            /* 삭제할 경로들 전부 삭제 */ 
            await Promise.all(
                this.deleteCommandArray.map((path, index) => {
                    if( index <= 1 ) {
                        const { Key } = path;
                        /* ai팀과 공통으로 쓰는 folder에 저장된 파일 삭제 */
                        unlink( `/home/ubuntu/${Key}`, (err) => console.log(
                            'unlink error in notUploadVideoCommand...', err)
                        );                                              
                    }
                    this.s3Client.send( new DeleteObjectCommand(path) )
                })
            );
        }
        catch(err) {
            console.log('delete bucket error in NotUploadVideoCommand....', err);
        }
    }
}