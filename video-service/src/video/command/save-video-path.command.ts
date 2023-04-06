import { ICommand } from "@nestjs/cqrs";

export class SaveVideoPathCommand implements ICommand {
    constructor( 
        public readonly userId: string,
        public readonly videoPath: string[]
    ) {}
}