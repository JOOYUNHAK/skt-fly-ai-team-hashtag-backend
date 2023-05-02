import { Mapper, MappingProfile, createMap, forMember, ignore, mapFrom } from "@automapper/core";
import { AutomapperProfile, InjectMapper } from "@automapper/nestjs";
import { Injectable } from "@nestjs/common";
import { StartSummaryDto } from "../dto/start-summary.dto";
import { CompleteSummaryDto } from "../dto/complete-summary.dto";
import { VideoMetaInfo } from "../../domain/video/video-meta-info";
import { VideoSummaryInfo } from "../../domain/video/video-summary-info";

@Injectable()
export class VideoProfile extends AutomapperProfile {
    constructor(@InjectMapper() mapper: Mapper) {
        super(mapper);
    }

    override get profile(): MappingProfile {
        return (mapper) => {
            createMap(mapper, StartSummaryDto, VideoMetaInfo, 
                forMember(dest => dest.originVideoPath, mapFrom(source => source.originVideoPath)),
                forMember(dest => dest.category, mapFrom(source => source.category)),
            ),
            createMap(mapper, CompleteSummaryDto, VideoSummaryInfo);
        };
    }
}