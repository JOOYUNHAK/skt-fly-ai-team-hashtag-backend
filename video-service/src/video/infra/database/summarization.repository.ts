import { Inject, Injectable } from "@nestjs/common";
import { Summarization } from "src/video/domain/summarization/entity/summarization.entity";
import { ISummarizationRepository } from "src/video/domain/summarization/repository/isummarization.repository";
import { Repository } from "typeorm";

@Injectable()
export class SummarizationRepository extends Repository<Summarization> implements ISummarizationRepository {
    constructor(
        @Inject('SUMMARIZATION_REPOSITORY')
        private readonly summarizationRepository: Repository<Summarization>
    ) {
        super(Summarization, summarizationRepository.manager)
    }
    /* 아이디로 요약 내용 찾기 */ 
    async findById(summarizationId: number): Promise<Summarization> {
        return await this.summarizationRepository
            .createQueryBuilder('summary')
            .leftJoinAndSelect('summary.result', 'result')
            .where('summary.id = :id', { id: summarizationId} )
            .getOne();
    }
}