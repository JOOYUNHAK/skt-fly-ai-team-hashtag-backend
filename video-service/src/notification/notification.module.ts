import { Module } from "@nestjs/common";
import { NotificationController } from "./interface/notification.controller";
import { SseNotificationService } from "./application/sse-notification.service.ts";
import { SSERepository } from "./infra/sse.repository";
import { CqrsModule } from "@nestjs/cqrs";
import { SummarizationCompletedEventHandler } from "./application/event-handler/summarization-completed";

@Module({
    imports: [
        CqrsModule,
    ],  
    controllers: [NotificationController],
    providers: [
        SseNotificationService,
        SSERepository,
        SummarizationCompletedEventHandler
    ],
    exports: [
        SummarizationCompletedEventHandler
    ]
})

export class NotificationModule {}