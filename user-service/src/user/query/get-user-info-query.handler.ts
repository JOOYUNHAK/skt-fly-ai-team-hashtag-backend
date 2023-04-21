import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { GetUserInfoQuery } from './get-user-info.query';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, map } from 'rxjs';
import { UserInfoResponseDto } from '../dto/user-info-response.dto';


@QueryHandler(GetUserInfoQuery)
export class GetUserInfoQueryHandler implements IQueryHandler<GetUserInfoQuery> {
    constructor(
        @Inject('DATA_SOURCE')
        private readonly dataSource: DataSource,
        private readonly httpService: HttpService
    ) {}    
    async execute(query: GetUserInfoQuery): Promise<UserInfoResponseDto> {
        const selectQuery = 
            'SELECT LOWER(HEX(`UserView`.`id`)) AS `id`, `UserView`.`nickname` AS `nickname` FROM `user_view` `UserView` WHERE (`UserView`.`id` = unhex(?))'
        
        const [ likeList, userInfo ] = await Promise.all([
            this.getLikeList(query.getId()),
            this.dataSource.manager.query(selectQuery, [query.getId()])
        ]);

        return {
            ...userInfo[0],
            videoLikeList: [
                ...likeList
            ]
        }
    }

    async getLikeList(id: string): Promise<LikeListResponse> {
        const request$ = this.httpService
                            .get(`http://127.0.0.1:8082/like/list/${id}`)
                            .pipe(map(res => res.data))
        return await firstValueFrom(request$);
    }
}

export type LikeListResponse = string[]