import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../entity/user.entity';
import { FindUserByPhoneNumberQuery } from "./find-user-ph.query";
import { FindByPhoneNumberResponseDto } from '../dto/find-by-ph-response.dto';

@QueryHandler(FindUserByPhoneNumberQuery)
export class FindUserByPhoneNumberQueryHandler implements IQueryHandler<FindUserByPhoneNumberQuery> {
    constructor(
        @Inject('USER_REPOSITORY')
        private readonly userRepository: Repository<User>
    ) {}

    async execute(query: FindUserByPhoneNumberQuery): Promise<FindByPhoneNumberResponseDto> {
        const { phoneNumber } = query;
        const id = await this.userRepository
            .createQueryBuilder()
            .select('id')
            .where('phone_number = :phoneNumber', { phoneNumber })
            .getRawOne();
        console.log(phoneNumber)
        return id;
    }
}