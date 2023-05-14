import { Inject, Injectable } from "@nestjs/common";
import { Summarization } from "src/video/domain/summarization/entity/summarization.entity";
import { ISummarizationRepository } from "src/video/domain/summarization/repository/isummarization.repository";
import { Repository } from "typeorm";

@Injectable()
export class SummarizationRepository implements ISummarizationRepository {
    constructor(
        @Inject('SUMMARIZATION_REPOSITORY')
        private readonly summarizationRepository: Repository<Summarization>
    ) {}
    /* 처음 요약 시작했을 때 내용 저장 */
    async save(summarization: Summarization): Promise<Summarization> {
        //await this.db.collection('summarization').insertOne(videoSummarization);
        return await this.summarizationRepository.save(summarization);
    }
    /* 아이디로 요약 내용 찾기 */ 
    async findById(summarizationId: number): Promise<Summarization> {
        return await this.summarizationRepository
            .createQueryBuilder('summary')
            .leftJoinAndSelect('summary.result', 'result')
            .where('summary.id = :id', { id: summarizationId} )
            .getOne();
        //return (await this.summarizationRepository.findBy({id: summarizationId}))[0]
    }
    /* 요약에 실패하면 저장되어 있던 내용 삭제 */
    async delete(summarization: Summarization): Promise<void> {
        /* 추후 delete문으로 변경 */ 
        await this.summarizationRepository.remove(summarization);
    }
}