import { ICommand } from "@nestjs/cqrs";
import { Session } from "better-sse";

export class SaveSSEInstanceCommand implements ICommand {
    constructor( 
        readonly userId: string,
        readonly session: Session
    ) {}
}