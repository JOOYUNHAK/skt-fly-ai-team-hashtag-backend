import { Injectable, Req, Res } from "@nestjs/common";
import { INotificationService } from "../domain/service/inotification.service";
import { createSession } from "better-sse";
import { Request, Response } from "express";
import { SSERepository } from "../infra/sse.repository";

@Injectable()
export class SseNotificationService implements INotificationService {
    constructor(
        private readonly sseRepository: SSERepository
    ) {}
    async createConnection(@Req() req: Request, @Res() res: Response) {
        const session = await createSession(req, res, { keepAlive: 50000});
        return await this.sseRepository.save(req.body.userId, session);
    }
}