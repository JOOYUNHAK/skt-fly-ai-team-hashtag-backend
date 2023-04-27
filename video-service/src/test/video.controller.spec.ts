import { CommandBus, EventBus } from "@nestjs/cqrs";
import { Test, TestingModule } from "@nestjs/testing";
import { VideoController } from "../video/video.controller";
import { SaveVideoPathStub, VideoSummaryResponseStub } from "./stub/dto.stub";
import { ConfigModule } from "@nestjs/config";
import { HttpModule, HttpService } from "@nestjs/axios";
import { cqrsMock } from "../video/__mock__/cqrs.mock";

describe('VideoController', () => {
    let videoController: VideoController;
    let commandBus: CommandBus;
    let httpService: HttpService
    let eventBus: EventBus;
    
    const saveVideoPathStub = SaveVideoPathStub();
    const videoSummaryResponseStub = VideoSummaryResponseStub()

    beforeEach(async () => {
        const moduleRef:TestingModule = await Test.createTestingModule({
            imports: [ConfigModule, HttpModule],
            controllers: [VideoController],
            providers: [
                cqrsMock.commandBus,
                cqrsMock.eventBus
            ]
        }).compile()

        videoController = moduleRef.get(VideoController);
        commandBus = moduleRef.get(CommandBus);
        eventBus = moduleRef.get(EventBus);
        httpService = moduleRef.get(HttpService);
    })   

    describe('POST /path', () => {

        afterEach(() => jest.clearAllMocks());
                
        test('Video Summary Success Response Test', async () => {
            const summaryResponseFromAiTeam = { data: {...videoSummaryResponseStub }}; 
            httpService.axiosRef.post = jest.fn().mockResolvedValueOnce(summaryResponseFromAiTeam) //Mock Axios Request
            await videoController.saveVideoPath(saveVideoPathStub); // Request From Clent
            
            const summaryCompleteEventCalledWith = {
                userId: videoSummaryResponseStub.user_ID, nickName: videoSummaryResponseStub.nickname, 
                thumbNailPath: videoSummaryResponseStub.video_image, videoPath: videoSummaryResponseStub.video_path, 
                tags: videoSummaryResponseStub.video_tag, category: videoSummaryResponseStub.category 
            }
            const savePathCommandCalledWith = { userId: saveVideoPathStub.userId, videoPath: saveVideoPathStub.videoPath };

            /* Should Send SavePathCommand Once */
            expect(commandBus.execute).toBeCalledTimes(1);
            expect(commandBus.execute).toBeCalledWith(savePathCommandCalledWith);

            /* Should Reuqest To Ai Team For Video Summary */
            expect(httpService.axiosRef.post).toBeCalledTimes(1); 

            /* Should Send VideoSummaryComplete Event */
            expect(eventBus.publish).toBeCalledTimes(1); 
            expect(eventBus.publish).toBeCalledWith(summaryCompleteEventCalledWith)
            });

        test('Video Summary Fail Response Test', async () => {
            httpService.axiosRef.post = jest.fn().mockRejectedValueOnce('Summary Fail')
            try {
                await videoController.saveVideoPath(saveVideoPathStub);
            }
            catch(err) {
                /* Should Send VideoSummaryFail Event */
                expect(eventBus.publish).toBeCalledWith( {userId: saveVideoPathStub.userId} );
            }
        })
    })
})