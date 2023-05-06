import { Module } from "@nestjs/common";
import { NotificationController } from "./interface/notification.controller";
import { SseNotificationService } from "./application/sse-notification.service.ts";
import { SSERepository } from "./infra/sse.repository";
import { CqrsModule } from "@nestjs/cqrs";
import { SummaryFailEventHandler } from "./application/event-handler/summary-fail-event.handler";
import { SummarySuccessEventHandler } from "./application/event-handler/summary-success-event.handler";

@Module({
    imports: [
        CqrsModule,
    ],  
    controllers: [NotificationController],
    providers: [
        SseNotificationService,
        SSERepository,
        SummarySuccessEventHandler,
        SummaryFailEventHandler
    ],
    exports: [
        SummarySuccessEventHandler,
        SummaryFailEventHandler
    ]
})

export class NotificationModule {}