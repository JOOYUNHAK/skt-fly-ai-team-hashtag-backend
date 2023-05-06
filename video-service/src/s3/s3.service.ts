import { DeleteObjectsCommand, S3Client, DeleteObjectsCommandInput } from "@aws-sdk/client-s3";
import { Inject, Injectable } from "@nestjs/common";
import AmazonS3URI from "amazon-s3-uri";

@Injectable()
export class S3Service {

    constructor(
        @Inject('S3_CLIENT')
        private s3Client: S3Client
    ) { }

    /* 여러 개의 Object 삭제 */
    async deleteObjects(urls: string[]) {
        const command = this.createDeleteCommands(urls);
        await this.s3Client.send(new DeleteObjectsCommand(command))
    }

    createDeleteCommands(urls: string[]): DeleteObjectsCommandInput {
        const Objects = []; let Bucket: string;
        urls.map((url, index) => {
            const { bucket, key } = AmazonS3URI(url)
            if (!index) Bucket = bucket;
            Objects.push({ Key: key });
        })
        return { Bucket, Delete: { Objects } }
    }
}