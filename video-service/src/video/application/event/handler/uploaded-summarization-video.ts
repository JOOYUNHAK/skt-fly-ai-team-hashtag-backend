import { Mapper } from "@automapper/core";
import { InjectMapper } from "@automapper/nestjs";
import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { firstValueFrom } from "rxjs";
import { Summarization } from "src/video/domain/summarization/entity/summarization.entity";
import { UploadedSummarizationVideoEvent } from "src/video/domain/summarization/event/uploaded-summarization-video.event";
import { Video } from "src/video/domain/video/entity/video.entity";
import { VideoRepository } from "src/video/infra/database/video.repository";

@EventsHandler(UploadedSummarizationVideoEvent)
export class UploadedSummarizationVideoEventHandler implements IEventHandler<UploadedSummarizationVideoEvent> {
    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
        private readonly videoRespository: VideoRepository,
        @InjectMapper()
        private readonly mapper: Mapper
    ) { }
    async handle(event: UploadedSummarizationVideoEvent) {
        const { summarization } = event;
        /* user service로부터 업로드 한 사용자의 닉네임 */
        const uploadUserNickName =
            await this.getUploaderToUserService(summarization.getUserId());
        /* 비디오 리스트 조회 모델로 구성해서 mongodb에 올리기 */
        const toUploadVideo:Video = this.mapper.map(summarization, Summarization, Video);
        await this.videoRespository.save(toUploadVideo.setNickName(uploadUserNickName));
    }

    async getUploaderToUserService(id: number): Promise<string> {
        const { data } = await firstValueFrom(
            this.httpService.get(
                `${this.configService 
                    .get('url.user_service')}/user/nickname/${id}`
            )
        );
        return data.nickName;
    }
}