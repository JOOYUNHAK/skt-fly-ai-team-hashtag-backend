import { ICommand } from "@nestjs/cqrs";

export class RegisterUserCommand implements ICommand {
    constructor(
        readonly phoneNumber:string,
        readonly nickName: string
    ) {}
}