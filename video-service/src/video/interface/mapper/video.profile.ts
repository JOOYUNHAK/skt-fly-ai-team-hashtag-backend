import { Mapper, MappingProfile, createMap, forMember, mapFrom } from "@automapper/core";
import { AutomapperProfile, InjectMapper } from "@automapper/nestjs";
import { Injectable } from "@nestjs/common";
import { StartSummaryDto } from "../dto/start-summary.dto";
import { CompleteSummaryDto } from "../dto/complete-summary.dto";
import { VideoMetaInfo } from "../../domain/video/video-meta-info";
import { VideoSummaryInfo } from "../../domain/video/video-summary-info";
import { Video } from "src/video/domain/video/video-domain";
import { VideoEntity } from "src/video/domain/video/entity/video.entity";
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
            createMap(mapper, CompleteSummaryDto, VideoSummaryInfo,
                forMember(dest => dest.tags, mapFrom(source => source.tags))    
            );
            // 완성된 비디오 데이터베이스에 저장
            createMap(mapper, Video, VideoEntity,
                forMember(dest => dest._id, mapFrom(source => new ObjectId(source.getId()))),
                forMember(dest => dest.metaInfo, mapFrom(source => source.getMetaInfo())),
                forMember(dest => dest.imagePath, mapFrom(source => source.getSummaryInfo().imagePath)),
                forMember(dest => dest.videoPath, mapFrom(source => source.getSummaryInfo().videoPath)),
                forMember(dest => dest.tags, mapFrom(source => source.getSummaryInfo().tags)),
            )
        };
    }
}