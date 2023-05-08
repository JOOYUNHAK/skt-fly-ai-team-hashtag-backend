import { Mapper, MappingProfile, createMap, forMember, mapFrom } from "@automapper/core";
import { AutomapperProfile, InjectMapper } from "@automapper/nestjs";
import { Injectable } from "@nestjs/common";
import { StartSummaryDto } from "../dto/start-summary.dto";
import { CompleteSummaryDto } from "../dto/complete-summary.dto";
import { VideoMetaInfo } from "../../domain/summarization/video-meta-info";
import { ResultInfo } from "src/video/domain/summarization/result-info";
import { VideoSummarization } from "src/video/domain/summarization/video-summarization";
import { MetaInfoEntity } from "src/video/domain/summarization/entity/meta-info.entity";
import { ObjectId } from "mongodb";

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
            )
        };
    }
}