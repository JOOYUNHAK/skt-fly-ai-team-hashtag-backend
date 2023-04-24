import { Module } from "@nestjs/common";
import { S3Service } from "./s3.service";
import { S3Provider } from "./s3.provider";

@Module({
    providers: [ 
        ...S3Provider,
        S3Service
    ],
    exports: [ 
        S3Service,
        ...S3Provider
    ]
})
export class S3Module {}