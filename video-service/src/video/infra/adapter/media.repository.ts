import { IMediaRepository } from "src/video/application/adapter/imedia.repository";
import { S3Service } from "../../../s3/s3.service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class MediaRepository implements IMediaRepository {
    constructor(
        private readonly s3Service: S3Service
    ) {}

    async delete(url: string[]): Promise<void> {
        await this.s3Service.deleteObjects(url);
    } 
}