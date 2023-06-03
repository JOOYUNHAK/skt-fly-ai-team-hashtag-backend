import { SummarizationMapper } from "src/video/application/mapper/summarization.mapper"
import { Summarization } from "src/video/domain/summarization/entity/summarization.entity";
import { StartSummaryDto } from "src/video/interface/dto/summarization/start-summary.dto"

describe('SummarizationMapper Test', () => {
    let summarizationMapper: SummarizationMapper;

    beforeEach(() => {
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
    })
})