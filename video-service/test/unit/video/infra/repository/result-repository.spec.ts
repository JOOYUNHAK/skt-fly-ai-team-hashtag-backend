import { SummarizationResult } from "src/video/domain/summarization/entity/summarization-result.entity";
import { SummarizationResultRepository } from "src/video/infra/database/summarization-result.repository";
import { SummarizationRepository } from "src/video/infra/database/summarization.repository"
import { TestingTypeORMOptions } from "test/integration/database/test-mysql.module"
import { DataSource } from "typeorm"
import { TestSummarization, TestSummarizationResult } from "../../fixture/test-summarization.fixture";
import { CompleteSummaryDto } from "src/video/interface/dto/summarization/complete-summary.dto";
import { Summarization } from "src/video/domain/summarization/entity/summarization.entity";

describe('요약결과 저장소 TEST', () => {
    const dataSorce = new DataSource(TestingTypeORMOptions);
    const summarizationRepository =  new SummarizationRepository(dataSorce.getRepository(Summarization));
    const resultRepository = new SummarizationResultRepository(SummarizationResult, dataSorce.manager);

    beforeAll(async () => await dataSorce.initialize());
    afterAll(async () => {
        await dataSorce.dropDatabase();
        await dataSorce.destroy();
    });

    describe('save()', () => {
        it('요약요청 정보의 아이디에 해당하는 성공 결과가 저장되어야 한다.', async () => {
            const summarizationStub = TestSummarization.create(null, '01022223333', ['http:www.aws.com'], ['청년']);
            const saveSummarization = await summarizationRepository.save(summarizationStub);

            const completeSummaryDto = CompleteSummaryDto.of(
                saveSummarization.getId(), 'http:aws.image.com', 'http:aws.video.com', ['태그1'], 'succeded'
            );
            const summarizationResultStub = TestSummarizationResult.create(
                completeSummaryDto.summarizationId,
                completeSummaryDto.message,
                completeSummaryDto.imagePath,
                completeSummaryDto.videoPath,
                completeSummaryDto.tags
            );
            const saveResult = await resultRepository.save(summarizationResultStub);

            expect(saveResult.summarizationId).toBe(saveSummarization.getId());
            expect(saveResult).toEqual(summarizationResultStub);
        });

        it('요약요청 정보의 아이디에 해당하는 실패 결과가 저장되어야 한다.', async () => {
            const summarizationStub = TestSummarization.create(null, '01022223333', ['http:www.aws.com'], ['실패']);
            const saveSummarization = await summarizationRepository.save(summarizationStub);

            const completeSummaryDto = CompleteSummaryDto.of(
                saveSummarization.getId(), null, null, null, 'FAILED'
            );
            const summarizationResultStub = TestSummarizationResult.create(
                completeSummaryDto.summarizationId,
                completeSummaryDto.message,
                completeSummaryDto.imagePath,
                completeSummaryDto.videoPath,
                completeSummaryDto.tags
            );
            const saveResult = await resultRepository.save(summarizationResultStub);
            expect(saveResult.summarizationId).toBe(saveSummarization.getId());
            expect(saveResult.getImagePath()).toBeNull();
            expect(saveResult.getVideoPath()).toBeNull();
            expect(saveResult.getTags()).toBeNull();
            expect(saveResult.getMessage()).toBe('FAILED');
        });
    })
})