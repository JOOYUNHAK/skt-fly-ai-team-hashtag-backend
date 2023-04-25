import { CommandBus, IEventHandler, QueryBus } from "@nestjs/cqrs";
import { SummaryCompleteEvent } from "./summary-complete.event";
import { LoadFileByFsQuery } from "../query/load-file-by-fs.query";
import { UploadFileToS3Command } from "../command/upload-file-to-s3.command";
import { GetBeforeSummaryVideoPathQuery } from "../query/get-before-summary-video-path-query";
import { SaveAiResponseCommand } from "../command/save-ai-response.command";

export class SummaryCompleteEventHandler implements IEventHandler<SummaryCompleteEvent> {
    constructor(
        private readonly queryBus: QueryBus,
        private readonly commandBus: CommandBus
    ) {}
    async handle(event: SummaryCompleteEvent) {
        const { userId, nickName, videoPath, thumbNailPath, tags, category } = event;
        /* AI 팀이 요약한 영상과 이미지 저장 경로로부터 가져오고 S3에 업로드*/
        const [ videoStream, thumbNailStream ] = await this.queryBus.execute(new LoadFileByFsQuery( videoPath, thumbNailPath ));
        await this.commandBus.execute(new UploadFileToS3Command(videoPath, thumbNailPath, videoStream, thumbNailStream));

        /* S3에 업로드 하고 난 이후 사용자가 영상을 보고 저장을 하지 
            않을수도 있으므로 요약 전 영상 경로와 함께 요약된 정보 저장 */
        const beforeSummaryVideoPath = await this.queryBus.execute(new GetBeforeSummaryVideoPathQuery(userId)); 
        await this.commandBus.execute(new SaveAiResponseCommand(userId, nickName, videoPath, thumbNailPath, tags, category, beforeSummaryVideoPath))
    }
}