import { IQuery } from '@nestjs/cqrs';

export class FindUserByPhoneNumberQuery implements IQuery {
    constructor(
        private phoneNumber: string
    ) {}

    getPhoneNumber() { return this.phoneNumber; }
}