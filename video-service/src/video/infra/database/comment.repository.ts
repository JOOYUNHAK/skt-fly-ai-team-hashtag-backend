import { Inject } from "@nestjs/common";
import { Db } from "mongodb";
import { ICommentRepository } from "src/video/domain/comment/repository/icomment.repository";
import { VideoComment } from "src/video/domain/comment/video-comment";

export class CommentRepository implements ICommentRepository {
    constructor(
        @Inject('MONGO_CONNECTION')
        private readonly db: Db
    ){}
    
    async save(videoComment: VideoComment): Promise<void> {
        await this.db
                .collection('comments')
                .insertOne(videoComment)
    }
}