import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { LoadFileByFsQuery } from "./load-file-by-fs.query";
import * as fs from 'fs';

@QueryHandler(LoadFileByFsQuery)
export class LoadFileByFsQueryHandler implements IQueryHandler<LoadFileByFsQuery> {
    async execute(query: LoadFileByFsQuery): Promise<fs.ReadStream []> {
        /* 저장된 경로에서 파일들 읽기 */
        const { videoPath, thumbNailPath } = query;
        try {
            return await Promise.all([
                fs.createReadStream(videoPath),
                fs.createReadStream(thumbNailPath)
            ]);
        }
        catch (err) {
            console.log('createReadStream error...', err);
        };
    }
}