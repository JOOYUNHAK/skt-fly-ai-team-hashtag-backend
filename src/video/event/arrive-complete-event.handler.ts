import { CommandBus, EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { SaveAiResponseCommand } from "../command/save-ai-response.command";
import { ArriveCompleteEvent } from "./arrive-complete.event";

@EventsHandler(ArriveCompleteEvent)
export class ArriveCompleteEventHandler implements IEventHandler<ArriveCompleteEvent> {
    constructor(
        // aws 작성
        private readonly commandBus: CommandBus
    ) {}
    
    handle(event: ArriveCompleteEvent) {
        const { userId, videoImage, videoPath, videoTag } = event;
        this.commandBus.execute( new SaveAiResponseCommand(userId, videoImage, videoPath, videoTag));
    }
}