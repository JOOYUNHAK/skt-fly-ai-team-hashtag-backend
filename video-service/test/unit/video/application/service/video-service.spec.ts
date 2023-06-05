import { Test } from "@nestjs/testing"
import { SummarizationMapper } from "src/video/application/mapper/summarization.mapper";
import { VideoService } from "src/video/application/video.service"
import { SummarizationRepository } from "src/video/infra/database/summarization.repository";
import { TestSummarization, TestSummarizationResult } from "../../fixture/test-summarization.fixture";
import { SummaryStatus } from "src/video/domain/summarization/enum/summary-status.enum";
import { DataSource } from "typeorm";
import { TestingTypeORMOptions } from "test/integration/database/test-mysql.module";
import { CompleteSummaryDto } from "src/video/interface/dto/summarization/complete-summary.dto";
import { SummarizationResult } from "src/video/domain/summarization/entity/summarization-result.entity";
import { CqrsModule, EventPublisher } from "@nestjs/cqrs";
import { Summarization } from "src/video/domain/summarization/entity/summarization.entity";
import { SummarizationCompletedEvent } from "src/video/domain/summarization/event/summarization-completed.event";

describe('VideoService Test', () => {
    let dataSource: DataSource;
    let summarizationMapper: SummarizationMapper;
    let summarizationRepository: SummarizationRepository;
    let publisher: EventPublisher;

    beforeAll(async () => {
        const module = await Test.createTestingModule({
            imports: [CqrsModule],
            providers: [
                VideoService,
                SummarizationMapper,
                {
                    provide: 'SUMMARIZATION_REPOSITORY',
                    useValue: {}
                },
                SummarizationRepository
            ],
        }).compile();

        publisher = module.get(EventPublisher);
        summarizationMapper = module.get(SummarizationMapper);
        summarizationRepository = module.get(SummarizationRepository);
        dataSource = new DataSource(TestingTypeORMOptions);
        await dataSource.initialize();
    });

    afterAll(async () => {
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
            const savedSummarization = await dataSource.getRepository(Summarization).save(summarization);
            expect(savedSummarization).toEqual(summarization);
            expect(savedSummarization.getStatus()).toBe(SummaryStatus.SUMMARYING);
            expect(savedSummarization.getUserId()).toBe('01022223333');
        });
    });

    describe('completeVideoSummary()', () => {
        it('요약이 완료되면 상태가 SUMMARIZED로 변경되고 요약 완료 Event가 발행된다.', async () => {
            const savedSummarization = TestSummarization.create(1, '01022223333', ['http:www.aws.com'], ['청년']);
            jest.spyOn(summarizationRepository, 'findById').mockResolvedValueOnce(savedSummarization);
            const summarization = publisher.mergeObjectContext(await summarizationRepository.findById(1));
            summarization.summarized();
            expect(summarization.getStatus()).toBe(SummaryStatus.SUMMARIZED);
            

            const [unCommitedEvent] = summarization.getUncommittedEvents();
            expect(unCommitedEvent).toBeInstanceOf(SummarizationCompletedEvent);
            
            summarization.commit();
            const unCommitedEventLength = summarization.getUncommittedEvents().length;
            expect(unCommitedEventLength).toBe(0);
        });

        it.each([
            CompleteSummaryDto.of(
                1, 'http:aws.image.com', 'http:aws.video.com', ['태그1'], 'succeded'
            ),
            CompleteSummaryDto.of(
                1, null, null, null, 'FAILED'
            ),
        ])('요약결과가 도착하면 결과 매시지($message)에 따라 객체가 생성된다', (completeSummaryDto) => {
            const summarizationResultStub = TestSummarizationResult.create(
                completeSummaryDto.summarizationId,
                completeSummaryDto.message,
                completeSummaryDto.imagePath,
                completeSummaryDto.videoPath,
                completeSummaryDto.tags
            );
            jest.spyOn(summarizationMapper, 'resultFrom').mockReturnValueOnce(summarizationResultStub);
            const summarizationResult = summarizationMapper.resultFrom(completeSummaryDto);

            expect(summarizationResult).toBeInstanceOf(SummarizationResult);
            expect(summarizationResult).toEqual(completeSummaryDto);
        }); 
    })
})