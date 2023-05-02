import { Inject } from "@nestjs/common";
import { IVideoRepository } from "../domain/video/repository/ivideo.repository";
import { Video } from "../domain/video/video-domain";
import { RedisClientType } from "redis";
import { plainToInstance } from 'class-transformer';

export class VideoRepository implements IVideoRepository {
    constructor(
        @Inject('REDIS_CLIENT')
        private readonly redis: RedisClientType
    ) {}
    
    /* 요약 시작하고 비디오 메타데이터와 RUNNING상태 저장 */
    async updateSummaryInfo(video: Video): Promise<void> {
        await this.redis.HSET('process:video:list', `video:${video.getId()}`, JSON.stringify(video));
    }

    /* 요약 시작할 때 저장해놨던 정보 비디오 id로 찾기 */
    async findSummaryInfoById(videoId: string): Promise<Video> {
        return plainToInstance(
                Video ,
                JSON.parse( await this.redis.HGET('process:video:list', `video:${videoId}`) 
            ) 
        );
    }
}