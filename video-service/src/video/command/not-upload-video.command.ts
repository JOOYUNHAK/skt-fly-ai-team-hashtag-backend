import { ICommand } from "@nestjs/cqrs";

export class NotUploadVideoCommand implements ICommand {
    constructor( public readonly userId: string ) {}
}