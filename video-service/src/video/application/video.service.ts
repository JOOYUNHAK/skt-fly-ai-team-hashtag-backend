import { Injectable } from "@nestjs/common";
import { VideoMetaInfo } from "../domain/video/video-meta-info";
import { Video } from "../domain/video/video-domain";
import { VideoSummaryInfo } from "../domain/video/video-summary-info";
import { ObjectId } from "mongodb";
import { EventBus, EventPublisher } from "@nestjs/cqrs";
import { InjectMapper } from "@automapper/nestjs";
import { Mapper } from "@automapper/core";
import { VideoEntity } from "../domain/video/entity/video.entity";
import { VideoRepository } from "../infra/database/video.repository";
import { VideoDeletedEvent } from "./event/video-deleted.event";

@Injectable()
export class VideoService {
    constructor(
        private readonly videoRepository: VideoRepository,
        private readonly publisher: EventPublisher,
        private readonly eventBus: EventBus,
        @InjectMapper()
        private readonly mapper: Mapper
    ) {}
    
    /* 요약 시작했을 때 Lambda로부터 요약 하려는 영상에 관한 정보 수신 */
    async startVideoSummary(videoMetaInfo: VideoMetaInfo) {
        const video:Video = new Video( new ObjectId().toString() );
        video.setVideoMetaInfo(videoMetaInfo).startSummary(); // 요약 시작 AI 팀에겐 요약할 영상 경로 전달이 완료된 상태
        await this.videoRepository.updateSummaryInfo(video); // 요약 과정 업데이트
    }

    /* 요약 완료되었을 때 성공하면 Lambda로부터 
        실패하면 AI 팀으로부터 요약 결과 수신 */
    async completeVideoSummary(videoSummaryInfo: VideoSummaryInfo) {
        const video: Video = this.publisher.mergeObjectContext(
            await this.videoRepository.findSummaryInfoById(videoSummaryInfo.getId())
        );
        video.setVideoSummaryInfo(videoSummaryInfo);
        videoSummaryInfo.getStatus() === 'FAILED' 
            ? video.summaryFailed() : 
                video.summarySucceed();
        video.commit();
    }

    /* 요약 완료 이후 사용자가 마음에 들면 영상 업로드 */
    async uploadVideo(videoId: string, title: string) {
        const video:Video = await this.videoRepository.findSummaryInfoById(videoId);
        video.setTitle(title);
        await this.videoRepository.save(this.mapper.map(video, Video, VideoEntity));
        await this.videoRepository.deleteSummaryInfoById(video.getId()); // 저장했으면 요약 정보 삭제
    }

    /* 요약 영상이 마음에 들지 않으면 중간 요약 정보들 전부 삭제 */
    async notUploadVideo(videoId: string): Promise<void> {
        const video:Video = await this.videoRepository.findSummaryInfoById(videoId);
        await this.videoRepository.deleteSummaryInfoById(videoId);
        /* 요약 과정의 정보를 삭제했으면 실제 미디어 파일들 삭제 */
        this.eventBus.publish(new VideoDeletedEvent(video)); 
    }
}