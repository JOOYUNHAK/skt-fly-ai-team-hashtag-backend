import { Mapper, MappingProfile, createMap, forMember, fromValue, mapFrom } from "@automapper/core";
import { AutomapperProfile, InjectMapper } from "@automapper/nestjs";
import { Injectable } from "@nestjs/common";
import { StartSummaryDto } from "../dto/summarization/start-summary.dto";
import { CompleteSummaryDto } from "../dto/summarization/complete-summary.dto";
import { VideoMetaInfo } from "../../domain/summarization/video-meta-info";
import { ResultInfo } from "src/video/domain/summarization/result-info";
import { VideoSummarization } from "src/video/domain/summarization/video-summarization";
import { MetaInfoEntity } from "src/video/domain/summarization/entity/meta-info.entity";
import { ObjectId } from "mongodb";
import { Video } from "src/video/domain/video/entity/video.entity";
import { AddCommentDto } from "../dto/comment/add-comment.dto";
import { VideoComment } from "src/video/domain/comment/video-comment";
import { LikeRequestDto } from "../dto/like/like-request.dto";
import { Like } from "src/video/domain/like/like";

@Injectable()
export class VideoProfile extends AutomapperProfile {
    constructor(@InjectMapper() mapper: Mapper) {
        super(mapper);
    }

    override get profile(): MappingProfile {
        return (mapper) => {
            // 요약 시작할 때 요약하는 비디오의 정보
            createMap(mapper, StartSummaryDto, VideoMetaInfo, 
                forMember(dest => dest.originVideoPath, mapFrom(source => source.originVideoPath)),
                forMember(dest => dest.category, mapFrom(source => source.category)),
            ),
            // 요약 완료되었을 때 정보
            createMap(mapper, CompleteSummaryDto, ResultInfo,
                forMember(dest => dest.tags, mapFrom(source => source.tags))
            ),
            createMap(mapper, VideoSummarization, MetaInfoEntity,
                forMember(dest => dest._id, mapFrom(source => new ObjectId(source.getId()))),
                forMember(dest => dest.metaInfo, mapFrom(source => source.getMetaInfo())),
            ),
            createMap(mapper, VideoSummarization, Video,
                forMember(dest => dest.summarizationId, mapFrom(source => source.getId().toString())),
                forMember(dest => dest.userId, mapFrom(source => source.getMetaInfo().userId)),
                forMember(dest => dest.nickName, mapFrom(source => source.getMetaInfo().nickName)),
                forMember(dest => dest.imagePath, mapFrom(source => source.getResultInfo().imagePath)),
                forMember(dest => dest.videoPath, mapFrom(source => source.getResultInfo().videoPath)),
                forMember(dest => dest.tags, mapFrom(source => source.getResultInfo().tags)),
                forMember(dest => dest.uploadedAt, mapFrom(_ => new Date())),
                forMember(dset => dset.likeCount, fromValue(0)),
                forMember(dest => dest.comments, fromValue([]))
            ),
            createMap(mapper, AddCommentDto, VideoComment,
                forMember(dest => dest._id, mapFrom(_ => new ObjectId())),
                forMember(dest => dest.videoId, mapFrom(source => new ObjectId(source.videoId))),
                forMember(dest => dest.commentedAt, mapFrom(source => new Date()))
            ),
            createMap(mapper, LikeRequestDto, Like)
        };
    }
}