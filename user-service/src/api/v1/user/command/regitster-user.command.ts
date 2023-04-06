export class RegisterUserCommand {
    constructor(
        readonly id: string,
        readonly phoneNumber:string,
        readonly nickName: string
    ) {}
}