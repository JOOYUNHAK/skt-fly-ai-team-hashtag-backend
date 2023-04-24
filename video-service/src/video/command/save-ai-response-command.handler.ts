import { Inject } from "@nestjs/common";
import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { RedisClientType } from "redis";
import { SaveAiResponseCommand } from "./save-ai-response.command";
import { SummaryContentSaveCompleteEvent } from "../event/summary-content-save-complete.event";
import { S3Service } from "src/aws/s3/s3.service";
import { ConfigService } from "@nestjs/config";

@CommandHandler(SaveAiResponseCommand)
export class SaveAiResponseCommandHandler implements ICommandHandler<SaveAiResponseCommand> {
    constructor(
        @Inject('REDIS_CLIENT')
        private readonly redis: RedisClientType,
        private readonly s3Service: S3Service,
        private configService: ConfigService,
        private readonly eventBus: EventBus
    ) {}

    /* 요약된 영상 제목 입력 받기 전 임시 데이터 합쳐서 저장 */
    async execute(command: SaveAiResponseCommand): Promise<void> {
        const { userId, nickName, videoPath, thumbNailPath, tags, category, beforeSummaryVideoPath } = command;
        // S3에 업로드 한 파일 URL
        const [s3VideoURL, s3ImageURL] = [
            this.s3Service.createS3FileURL(this.configService.get('AWS.S3.BUCKET'), this.configService.get('AWS.S3.REGION'), this.s3Service.getKey('video', videoPath) ),
            this.s3Service.createS3FileURL(this.configService.get('AWS.S3.BUCKET'), this.configService.get('AWS.S3.REGION'), this.s3Service.getKey('image', thumbNailPath) ),
        ];
        // 제목을 제외한 데이터 저장
        const tempVideoDataExceptTitle = JSON.stringify({ userId, nickName, s3ImageURL, s3VideoURL, tags, category, beforeSummaryVideoPath });
        await this.redis.HSET('process:video:list', `user:${userId}`, tempVideoDataExceptTitle);
        // 저장완료했으면 사용자에게 SSE로 알림
        this.eventBus.publish(new SummaryContentSaveCompleteEvent(userId, nickName, s3VideoURL, s3ImageURL, tags));
    }
}       