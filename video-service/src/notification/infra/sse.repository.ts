import { Injectable } from "@nestjs/common";
import { INotificationRepository } from "../domain/repository/inotification.repository";

@Injectable()
export class SSERepository implements INotificationRepository {
    private sseMap;
    
    constructor() { this.sseMap = {}; } 
    
    async save (userId: string, emitter: any):Promise<void> {
        this.sseMap[`${userId}`] = emitter;
    }

    findByUserId(userId: number): any {
        return this.sseMap[`${userId}`];
    }

    delete(userId: number): any {
        delete this.sseMap[`${userId}`];
    }
}