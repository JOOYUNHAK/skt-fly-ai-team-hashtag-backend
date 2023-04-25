import { IEvent } from "@nestjs/cqrs";

export class SummaryFailEvent implements IEvent {
    constructor( readonly userId: string ) {}
}