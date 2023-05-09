import { DataSource } from "typeorm";
import { User } from "../../domain/entity/user.entity";

export const userProvider = [
    {
        provide: 'USER_REPOSITORY',
        useFactory: (dataSource: DataSource) => dataSource.getRepository(User),
        inject: ['DATA_SOURCE']
    }
];