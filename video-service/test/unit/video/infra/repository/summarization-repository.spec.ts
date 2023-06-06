import { SummarizationResult } from "src/video/domain/summarization/entity/summarization-result.entity";
import { SummarizationResultRepository } from "src/video/infra/database/summarization-result.repository";
import { SummarizationRepository } from "src/video/infra/database/summarization.repository"
import { TestingTypeORMOptions } from "test/integration/database/test-mysql.module"
import { DataSource } from "typeorm"
import { TestSummarization, TestSummarizationResult } from "../../fixture/test-summarization.fixture";
import { CompleteSummaryDto } from "src/video/interface/dto/summarization/complete-summary.dto";
import { Summarization } from "src/video/domain/summarization/entity/summarization.entity";

describe('요약정보 저장소 TEST', () => {
    const dataSorce = new DataSource(TestingTypeORMOptions);
    const summarizationRepository =  new SummarizationRepository(dataSorce.getRepository(Summarization));
    const resultRepository = new SummarizationResultRepository(SummarizationResult, dataSorce.manager);

    beforeAll(async () => await dataSorce.initialize());

    afterAll(async () => {
        await dataSorce.dropDatabase();
        await dataSorce.destroy();
    });

    describe('delete()', () => {
        it('요약요청 정보를 삭제하면 결과도 함께 삭제(CASECADE)되어야 한다.', async () => {
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
            await resultRepository.save(summarizationResultStub);
            
            const savedId = saveSummarization.getId();
            await summarizationRepository.delete(savedId);
            
            const deleted = await summarizationRepository.findById(savedId);
            expect(deleted).toBeNull();

            const deleteResult = await resultRepository.createQueryBuilder().where('summarization_id = :id', { id: savedId }).getOne();
            expect(deleteResult).toBeNull();
        });
    })
})