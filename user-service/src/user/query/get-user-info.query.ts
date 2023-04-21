import { IQuery } from '@nestjs/cqrs';
export class GetUserInfoQuery implements IQuery {
    constructor( private id: string ) {}

    getId() { return this.id; }
}