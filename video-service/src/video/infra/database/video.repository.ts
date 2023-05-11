import { Inject } from "@nestjs/common";
import { IVideoRepository } from "../../domain/video/repository/ivideo.repository";
import { Db, ObjectId } from "mongodb";
import { Video } from "src/video/domain/video/entity/video.entity";
import { VideoComment } from "src/video/domain/comment/video-comment";

export class VideoRepository implements IVideoRepository {
    constructor(
        @Inject('MONGO_CONNECTION')
        private readonly db: Db
    ) {}
    
    async save(video: Video): Promise<void> {
        await this.db
                .collection('video')
                .insertOne({
                    ...video,
                    uploadedAt: new Date()
                });
    }

    async findThumbNailByUserId(userId: number): Promise<any>{  
        return await this.db
                        .collection('video')
                        .find(
                            { userId },
                            {
                                sort: { _id: -1 }, 
                                projection: { imagePath: 1 } 
                            }
                        )
                        .toArray()
    }

    /* 각 비디오에 대한 댓글 일정 갯수의 최신 데이터 보관 */
    async updateVideoComment(videoId: ObjectId, videoComment: VideoComment): Promise<void> {
        await this.db
                .collection('video')
                .updateOne(
                    { _id: videoId },
                    { 
                        $push: {
                            comments: {
                                $each: [videoComment], 
                                $position: 0,
                                $slice: 5
                            }
                        }
                    },
                )
    }

    /* 비디오 좋아요 개수 업데이트 */
    async updateVideoLike(videoId: string, value: number): Promise<void> {
        await this.db
                .collection('video')
                .updateOne(
                    { _id: new ObjectId(videoId) },
                    { $inc: { likeCount: value }}
                )
    }
}