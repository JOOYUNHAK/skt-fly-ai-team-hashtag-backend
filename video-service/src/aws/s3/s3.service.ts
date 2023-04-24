import { PutObjectCommand, PutObjectCommandInput, S3Client } from "@aws-sdk/client-s3";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as fs from "node:fs";
import * as path from "path";

@Injectable()
export class S3Service {
    constructor(
        private readonly configService: ConfigService,
        private readonly s3Client: S3Client,
        private readonly bucket: string,
        private readonly region: string
    ) {
        this.s3Client = new S3Client({
            region: this.configService.get('AWS.S3.REGION'),
            credentials: {
                accessKeyId: this.configService.get('AWS.S3.ACCESS_KEY_ID'),
                secretAccessKey: this.configService.get('AWS.S3.SECRET_ACCESS_KEY')
            }
        })
        this.bucket = this.configService.get('AWS.S3.BUCKET');
        this.region = this.configService.get('AWS.S3.REGION');
    }

    getKey(type: string, filePath: string) {
        return type === 'image' ? 
            'images/' + path.basename(filePath) :
                'videos/' + path.basename(filePath);
    }

    async pubObjects(commands: PutObjectCommandInput []) {
        try {
            await Promise.all(
                commands.map( command => this.s3Client.send(new PutObjectCommand(command)) )
            )
        }
        catch( err ) {
            console.log('putObjectsError...');
        }
    }

    createPutObjectCommand(key: string, file: fs.ReadStream): PutObjectCommandInput {
        return {
            ACL: 'private',
            Bucket: this.bucket,
            Key: key,
            Body: file
        };
    }
}