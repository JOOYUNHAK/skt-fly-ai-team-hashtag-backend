import { Test } from "@nestjs/testing"
import { SummarizationMapper } from "src/video/application/mapper/summarization.mapper";
import { VideoService } from "src/video/application/video.service"
import { SummarizationRepository } from "src/video/infra/database/summarization.repository";
import { TestSummarization } from "../../fixture/test-summarization.fixture";
import { SummaryStatus } from "src/video/domain/summarization/enum/summary-status.enum";
import { DataSource } from "typeorm";
import { TestingTypeORMOptions } from "test/integration/database/test-mysql.module";

describe('VideoService Test', () => {
    let dataSource: DataSource;
    
    beforeAll(async () => {
        const module = await Test.createTestingModule({
            providers: [
                VideoService,
                SummarizationMapper,
                {
                    provide: SummarizationRepository,
                    useValue: {}
                }
            ],
        }).compile();
        
        dataSource = new DataSource(TestingTypeORMOptions);
        await dataSource.initialize();
    });

    afterAll( async () => {
        await dataSource.dropDatabase();
        await dataSource.destroy();
    });

    describe('startVideoSummary()', () => {
        it('요약을 시작하면 상태가 SUMMARYING로 변경되어야 한다', () => {
            // 요약 요청이 들어왔을 때
            const summarization = TestSummarization.create(null, '01022223333', ['http:www.aws.com'], ['가족', '열정']);
            summarization.started();
            expect(summarization.getStatus()).toBe(SummaryStatus.SUMMARYING);
        });

        it('생성된 요약 요청 정보는 DB에 저장이 되어야 한다', async () => {
            //요약 요청 정보를 저장하고 났을 때
            const summarization = TestSummarization.create(null, '01022223333', ['http:www.aws.com'], ['가족', '청년']);
            summarization.started();
            const savedSummarization = await dataSource.createEntityManager().save(summarization);

            expect(savedSummarization).toEqual(summarization);
            expect(savedSummarization.getStatus()).toBe(SummaryStatus.SUMMARYING);
            expect(savedSummarization.getUserId()).toBe('01022223333');
        });
    });
})