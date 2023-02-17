import { IEvent } from "@nestjs/cqrs";

export class CommunicationErrorAiEvent implements IEvent {
    constructor( public readonly userId: string ) {}
}