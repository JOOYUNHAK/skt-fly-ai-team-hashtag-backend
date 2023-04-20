import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { DataSource, Raw } from 'typeorm';
import { GetUserInfoQuery } from './get-user-info.query';
import { UserView } from '../entity/user-view.entity';

@QueryHandler(GetUserInfoQuery)
export class GetUserInfoQueryHandler implements IQueryHandler<GetUserInfoQuery> {
    constructor(
        @Inject('DATA_SOURCE')
        private readonly dataSource: DataSource
    ) {}    
    async execute(query: GetUserInfoQuery): Promise<any> {
        const { id } = query;
        return await this.dataSource.manager.query(
            'SELECT LOWER(HEX(`UserView`.`id`)) AS `id`, `UserView`.`nickname` AS `nickname` FROM `user_view` `UserView` WHERE (`UserView`.`id` = unhex(?))', [id]
        )
    }
}