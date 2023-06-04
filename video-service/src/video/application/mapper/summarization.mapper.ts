import { Injectable } from "@nestjs/common";
import { SummarizationResult } from "src/video/domain/summarization/entity/summarization-result.entity";
import { Summarization } from "src/video/domain/summarization/entity/summarization.entity";
import { CompleteSummaryDto } from "src/video/interface/dto/summarization/complete-summary.dto";
import { StartSummaryDto } from "src/video/interface/dto/summarization/start-summary.dto";

@Injectable()
export class SummarizationMapper {

    from(startSummaryDto: StartSummaryDto): Summarization {
        return new Summarization(
            null,
            startSummaryDto.userId,
            startSummaryDto.originVideoPath,
            startSummaryDto.category
        );
    };

    resultFrom(completeSummaryDto: CompleteSummaryDto): SummarizationResult {
        return new SummarizationResult(
            completeSummaryDto.summarizationId,
            completeSummaryDto.message,
            completeSummaryDto.imagePath,
            completeSummaryDto.videoPath,
            completeSummaryDto.tags
        );
    };
}