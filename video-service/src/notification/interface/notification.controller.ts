import { Controller, Post, Req, Res } from "@nestjs/common";
import { SseNotificationService } from "../application/sse-notification.service.ts";
import { Request, Response } from "express";

@Controller() 
export class NotificationController {
    constructor(
        private sseService: SseNotificationService
    ) {}
    @Post('sse')
    async createSSEConnection(@Req() req: Request, @Res() res: Response) {
        await this.sseService.createConnection(req, res);
    }
}