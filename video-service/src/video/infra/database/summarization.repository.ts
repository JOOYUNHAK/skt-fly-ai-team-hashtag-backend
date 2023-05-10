import { Inject, Injectable } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { Db, ObjectId } from "mongodb";
import { MetaInfoEntity } from "src/video/domain/summarization/entity/meta-info.entity";
import { ISummarizationRepository } from "src/video/domain/summarization/repository/isummarization.repository";
import { ResultInfo } from "src/video/domain/summarization/result-info";
import { VideoSummarization } from "src/video/domain/summarization/video-summarization";

@Injectable()
export class SummarizationRepository implements ISummarizationRepository {
    constructor(
        @Inject('MONGO_CONNECTION')
        private readonly db: Db
    ) {}
    /* 처음 요약 시작했을 때 내용 저장 */
    async save(metaInfo: MetaInfoEntity): Promise<void> {
        await this.db.collection('summarization').insertOne(metaInfo);
    }
    /* 아이디로 요약 내용 찾기 */ 
    async findById(summarizationId: string): Promise<VideoSummarization> {
        return plainToInstance(
                    VideoSummarization, 
                    await this.db
                            .collection('summarization')
                            .findOne<VideoSummarization>({ 
                                _id: new ObjectId(summarizationId)
                            }));
    }
    /* 요약 완료되었을 때 결과 업데이트 테이블 2개로 나눌 수 있음*/
    async updateResultInfo(resultInfo: ResultInfo): Promise<void> {
        await this.db
                    .collection('summarization')
                    .updateOne(
                        { _id: new ObjectId(resultInfo.getId())},
                        [
                            { $set: {   
                                resultInfo,
                                status: 'COMPLETED',
                                completedAt: "$$NOW",
                            }}
                        ]
                    )
    }
    
    async findAndUpdateOneField (id: string, field: string, value: any): Promise<VideoSummarization> {
        return plainToInstance(
            VideoSummarization,
            this.db
                .collection('summarization')
                .findOneAndUpdate(
                    { _id: new ObjectId(id) },
                    [
                        { $set: { 
                            [`${field}`]: value,
                            lastModified: "$$NOW"
                        }}
                    ],
                    {
                        projection: { 
                            completedAt: 0, lastModified: 0,
                            resultInfo: { message: 0 }, status: 0
                        },
                        returnDocument: 'after'
                    }
                )
                .then(newDocumentResult => newDocumentResult.value)
        )
    }
    /* 요약에 실패하면 저장되어 있던 내용 삭제 */
    async delete(id: string): Promise<void> {
        await this.db
                    .collection('summarization')
                    .deleteOne({ _id: new ObjectId(id) })
    }
}