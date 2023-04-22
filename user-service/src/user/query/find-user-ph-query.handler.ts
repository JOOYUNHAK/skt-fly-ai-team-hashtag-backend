import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../entity/user.entity';
import { FindUserByPhoneNumberQuery } from "./find-user-ph.query";
import { FindByPhoneNumberResult } from '../dto/find-by-ph-result.dto';

@QueryHandler(FindUserByPhoneNumberQuery)
export class FindUserByPhoneNumberQueryHandler implements IQueryHandler<FindUserByPhoneNumberQuery> {
    constructor(
        @Inject('USER_REPOSITORY')
        private readonly userRepository: Repository<User>
    ) {}

    async execute(query: FindUserByPhoneNumberQuery): Promise<FindByPhoneNumberResult> {
        return await this.userRepository
            .createQueryBuilder()
            .select('LOWER(HEX(id))', 'id')
            .where('phone_number = :phoneNumber', { phoneNumber: query.phoneNumber })
            .getRawOne();
    }
}