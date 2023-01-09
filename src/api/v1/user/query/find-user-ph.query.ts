import { IQuery } from '@nestjs/cqrs';
export class FindUserByPhoneNumberQuery implements IQuery {
    constructor(
        readonly phoneNumber: string
    ) {}
}