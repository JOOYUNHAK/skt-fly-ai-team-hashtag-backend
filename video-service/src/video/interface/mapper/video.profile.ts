import { Mapper, MappingProfile, createMap, forMember, fromValue, mapFrom } from "@automapper/core";
import { AutomapperProfile, InjectMapper } from "@automapper/nestjs";
import { Injectable } from "@nestjs/common";
import { ObjectId } from "mongodb";
import { Video } from "src/video/domain/video/entity/video.entity";
import { AddCommentDto } from "../dto/comment/add-comment.dto";
import { VideoComment } from "src/video/domain/comment/video-comment";
import { LikeRequestDto } from "../dto/like/like-request.dto";
import { Like } from "src/video/domain/like/like";
import { Summarization } from "src/video/domain/summarization/entity/summarization.entity";

@Injectable()
export class VideoProfile extends AutomapperProfile {
    constructor(@InjectMapper() mapper: Mapper) {
        super(mapper);
    }

    override get profile(): MappingProfile {
        return (mapper) => {
            /* 요약이 완료돼서 사용자가 업로드하면 조회모델로 변경하여 monogo에 업로드 */
            createMap(mapper, Summarization, Video,
                forMember(dest => dest.summarizationId, mapFrom(source => source.getId())),
                forMember(dest => dest.imagePath, mapFrom(source => source.getOutput().getImagePath())),
                forMember(dest => dest.videoPath, mapFrom(source => source.getOutput().getVideoPath())),
                forMember(dest => dest.tags, mapFrom(source => source.getOutput().getTags())),
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