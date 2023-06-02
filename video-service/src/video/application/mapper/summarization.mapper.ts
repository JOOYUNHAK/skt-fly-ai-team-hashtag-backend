import { Injectable } from "@nestjs/common";
import { Summarization } from "src/video/domain/summarization/entity/summarization.entity";
import { StartSummaryDto } from "src/video/interface/dto/summarization/start-summary.dto";

@Injectable()
export class SummarizationMapper {

    from(startSummaryDto: StartSummaryDto): Summarization {
        return new Summarization(
            startSummaryDto.userId,
            startSummaryDto.originVideoPath,
            startSummaryDto.category
        );
    };
    
}