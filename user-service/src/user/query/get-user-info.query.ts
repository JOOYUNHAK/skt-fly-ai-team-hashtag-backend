import { IQuery } from '@nestjs/cqrs';
export class GetUserInfoQuery implements IQuery {
    constructor( readonly id: string ) {}
}