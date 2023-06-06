import { Injectable } from "@nestjs/common";
import { EventBus, EventPublisher } from "@nestjs/cqrs";;
import { VideoRepository } from "../infra/database/video.repository";
import { NotUploadedVideoEvent } from "./event/not-uploaded-video.event";
import { SummarizationRepository } from "../infra/database/summarization.repository";
import { VideoComment } from "../domain/comment/video-comment";
import { CommentRepository } from "../infra/database/comment.repository";
import { Like } from "../domain/like/like";
import { LikeRepository } from "../infra/database/like.repository";
import { VideoLikeUpdatedEvent } from "./event/video-like-updated.event";
import { Summarization } from "../domain/summarization/entity/summarization.entity";
import { CompleteSummaryDto } from "../interface/dto/summarization/complete-summary.dto";
import { StartSummaryDto } from "../interface/dto/summarization/start-summary.dto";
import { SummarizationMapper } from "./mapper/summarization.mapper";
import { SummarizationResultRepository } from "../infra/database/summarization-result.repository";

@Injectable()
export class VideoService {
    constructor(
        private readonly videoRepository: VideoRepository,
        private readonly summarizationRepository: SummarizationRepository,
        private readonly summarizationMapper: SummarizationMapper,
        private readonly resultRepository: SummarizationResultRepository,
        private readonly commentRepository: CommentRepository,
        private readonly publisher: EventPublisher,
        private readonly eventBus: EventBus,
        private readonly likeRepository: LikeRepository,
    ) {}
    
    /* 요약 시작했을 때 Lambda로부터 요약 하려는 영상에 관한 정보 수신 */
    async startVideoSummary(startSummaryDto: StartSummaryDto): Promise<void> {
        const summarization = this.summarizationMapper.from(startSummaryDto);
        summarization.started();
        // 요약 시작 정보 저장
        await this.summarizationRepository.save(summarization);
    }

    /* 요약 완료되었을때  AI 팀으로부터 요약 결과 수신 */
    async completeVideoSummary(completeSummaryDto: CompleteSummaryDto) { 
        const summarization: Summarization = this.publisher.mergeObjectContext(
            await this.summarizationRepository.findById(completeSummaryDto.summarizationId)
        );
        summarization.summarized();
        await this.summarizationRepository.save(summarization);

        const summarizationResult = this.summarizationMapper.resultFrom(completeSummaryDto);
        await this.resultRepository.save(summarizationResult);
        summarization.commit();
    }

    /* 요약 완료 이후 사용자가 마음에 들면 영상 업로드 */
    async uploadVideo(summarizationId: number, title: string) {
        const summarization: Summarization = this.publisher.mergeObjectContext(
            await this.summarizationRepository.findById(summarizationId)
        )
        summarization.setTitle(title).upload();    
        await this.summarizationRepository.save(summarization);
        /*  영상 업로드 시 조회 모델로 변경 추후 도메인 이벤트로 */
        summarization.commit();
    }

    /* 요약 영상이 마음에 들지 않으면 요약 정보들 전부 삭제 */
    async notUploadVideo(summarizationId: number): Promise<void> {
        const summarization:Summarization = await this.summarizationRepository.findById(summarizationId);
        await this.summarizationRepository.delete(summarization);
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