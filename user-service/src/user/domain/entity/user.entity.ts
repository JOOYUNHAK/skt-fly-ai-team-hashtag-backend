import { AutoMap } from "@automapper/classes";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'user' })
export class User {
    @AutoMap()
    @PrimaryGeneratedColumn('increment')
    readonly id: number;

    @AutoMap()
    @Column({ type: 'varchar', length: 11, nullable: false, name: 'phone_number' })
    readonly phoneNumber: string;

    @AutoMap()
    @Column({ type: 'varchar', length: 20, nullable: false, name: 'nickname' })
    readonly nickName: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
    createdAt: Date
}