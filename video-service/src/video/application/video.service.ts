import { Injectable } from "@nestjs/common";
import { VideoMetaInfo } from "../domain/summarization/video-meta-info";
import { ObjectId } from "mongodb";
import { EventBus, EventPublisher } from "@nestjs/cqrs";
import { InjectMapper } from "@automapper/nestjs";
import { Mapper } from "@automapper/core";
import { Video } from "../domain/video/entity/video.entity";
import { VideoRepository } from "../infra/database/video.repository";
import { NotUploadedVideoEvent } from "./event/not-uploaded-video.event";
import { VideoSummarization } from "../domain/summarization/video-summarization";
import { SummarizationRepository } from "../infra/database/summarization.repository";
import { ResultInfo } from "../domain/summarization/result-info";
import { MetaInfoEntity } from "../domain/summarization/entity/meta-info.entity";
import { VideoComment } from "../domain/comment/video-comment";
import { CommentRepository } from "../infra/database/comment.repository";
import { Like } from "../domain/like/like";
import { LikeRepository } from "../infra/database/like.repository";
import { VideoLikeUpdatedEvent } from "./event/video-like-updated.event";

@Injectable()
export class VideoService {
    constructor(
        private readonly videoRepository: VideoRepository,
        private readonly summarizationRepository: SummarizationRepository,
        private readonly commentRepository: CommentRepository,
        private readonly publisher: EventPublisher,
        private readonly eventBus: EventBus,
        private readonly likeRepository: LikeRepository,
        @InjectMapper()
        private readonly mapper: Mapper
    ) {}
    
    /* 요약 시작했을 때 Lambda로부터 요약 하려는 영상에 관한 정보 수신 */
    async startVideoSummary(metaInfo: VideoMetaInfo) {
        const videoSummarization = new VideoSummarization( new ObjectId().toString() );
        videoSummarization.start(metaInfo);
        
        // 요약 시작 정보 저장
        await this.summarizationRepository.save(
            this.mapper.map(videoSummarization, VideoSummarization, MetaInfoEntity)
        );
    }

    /* 요약 완료되었을때  AI 팀으로부터 요약 결과 수신 */
    async completeVideoSummary(resultInfo: ResultInfo) {
        const videoSummarization: VideoSummarization = this.publisher.mergeObjectContext(
            await this.summarizationRepository.findById(resultInfo.getId())
        );
        videoSummarization.complete(resultInfo);
        videoSummarization.commit();
    }

    /* 요약 완료 이후 사용자가 마음에 들면 영상 업로드 */
    async uploadVideo(summarizationId: string, title: string) {
        const summarization: VideoSummarization = 
                         await this.summarizationRepository.findAndUpdateOneField(summarizationId, 'title', title);
                         
        /*  영상 업로드 시 video entity로 변경해서 비디오 조회시 해당 테이블 이용 */
        await this.videoRepository.save(this.mapper.map(summarization, VideoSummarization, Video));
    }

    /* 요약 영상이 마음에 들지 않으면 중간 요약 정보들 전부 삭제 */
    async notUploadVideo(summarizationId: string): Promise<void> {
        const summarization:VideoSummarization = await this.summarizationRepository.findById(summarizationId);
        await this.summarizationRepository.delete(summarizationId);

        /* 요약 과정의 정보를 삭제했으면 실제 미디어 파일들 삭제하기 위해 Event */
        this.eventBus.publish(new NotUploadedVideoEvent(summarization)); 
    }

    async getThumbNailPaths(userId: number): Promise<string []> {
        return await this.videoRepository.findThumbNailByUserId(userId);
    }

    /* 비디오에 대한 댓글 작성 */ 
    async addCommentToVideo(videoComment: VideoComment):Promise<void> {
        await this.commentRepository.save(videoComment); // 댓글 먼저 댓글 저장소에 저장
        /* 비디오 조회 모델에 일정 갯수의 댓글 올려놓기 위해 이벤트 발행 */ 
        this.publisher.mergeObjectContext(videoComment).commented(); 
        videoComment.commit();
    }

    async updateVideoLike(like: Like): Promise<void> {
        like.setState(
            await this.likeRepository.findByUserAndVideoId(like.videoId, like.userId)
        )
    
        await this.videoRepository.updateVideoLike( like.videoId, like.getCount());
        this.eventBus.publish(new VideoLikeUpdatedEvent(like));
    }
}