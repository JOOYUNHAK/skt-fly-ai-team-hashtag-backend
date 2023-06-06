import { SummarizationMapper } from "src/video/application/mapper/summarization.mapper"
import { SummarizationResult } from "src/video/domain/summarization/entity/summarization-result.entity";
import { Summarization } from "src/video/domain/summarization/entity/summarization.entity";
import { CompleteSummaryDto } from "src/video/interface/dto/summarization/complete-summary.dto";
import { StartSummaryDto } from "src/video/interface/dto/summarization/start-summary.dto"

describe('SummarizationMapper Test', () => {
    let summarizationMapper: SummarizationMapper;

    beforeAll(() => {
        summarizationMapper = new SummarizationMapper();
    });

    describe('from()', () => {
        it('dto를 summarization 객체로 변환해야 한다', () => {
            const startDto = StartSummaryDto.of('01022223333', ['http:www.aws.com'], ['가족', '희망']);
            const summarization = summarizationMapper.from(startDto);
            expect(summarization).toBeInstanceOf(Summarization);
            expect(summarization.getUserId()).toBe('01022223333');
            expect(summarization.getOriginVideoPath()[0]).toBe('http:www.aws.com');
        })
    });

    describe('resultFrom()', () => {
        it.each([
            CompleteSummaryDto.of(
                1, 'http:aws.image.com', 'http:aws.video.com', ['태그1'], 'succeded'
            ),
            CompleteSummaryDto.of(
                1, null, null, null, 'FAILED'
            )
        ])('요약결과($message)dto를 summarizationResult 객체로 변환해야 한다', (completeSummaryDto) => {
            const summarizationResult = summarizationMapper.resultFrom(completeSummaryDto);
            expect(summarizationResult).toBeInstanceOf(SummarizationResult);
            expect(summarizationResult.summarizationId).toBe(1);
            expect(summarizationResult.getMessage()).toBe(completeSummaryDto.message);
        })
    })
})