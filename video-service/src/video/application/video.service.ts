import { Injectable } from "@nestjs/common";
import { VideoMetaInfo } from "../domain/video/video-meta-info";
import { Video } from "../domain/video/video-domain";
import { VideoRepository } from "../infra/video.repository";
import { VideoSummaryInfo } from "../domain/video/video-summary-info";
import { ObjectId } from "mongodb";
import { EventPublisher } from "@nestjs/cqrs";

@Injectable()
export class VideoService {
    constructor(
        private readonly videoRepository: VideoRepository,
        private readonly publisher: EventPublisher
    ) {}
    
    async startVideoSummary(videoMetaInfo: VideoMetaInfo) {
        const video:Video = new Video( new ObjectId().toString() );
        video.setVideoMetaInfo(videoMetaInfo);
        video.startSummary(); // 요약 시작 AI 팀에겐 요약할 영상 경로 전달이 완료된 상태
        await this.videoRepository.updateSummaryInfo(video); // 요약 과정 업데이트
    }

    async completeVideoSummary(videoSummaryInfo: VideoSummaryInfo) {
        const video: Video = this.publisher.mergeObjectContext(
            await this.videoRepository.findSummaryInfoById(videoSummaryInfo.getId())
        );
        video.setVideoSummaryInfo(videoSummaryInfo);
        video.completeSummary();
        video.commit();
        await this.videoRepository.updateSummaryInfo(video);
    }
}