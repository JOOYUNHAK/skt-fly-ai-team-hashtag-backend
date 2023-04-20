import { ViewColumn, ViewEntity, DataSource } from 'typeorm';
import { User } from './user.entity';

@ViewEntity({
    expression: (dataSource: DataSource) =>
        dataSource
        .createQueryBuilder()
        .select("user.id", "id")
        .addSelect("user.nickname", "nickName")
        .from(User, 'user'),
})
export class UserView {
    @ViewColumn()
    id: string;

    @ViewColumn({
        name: 'nickname'
    })
    nickName: string;
}