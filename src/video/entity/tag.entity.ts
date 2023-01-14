import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity('tag')
export class Tag {
    @PrimaryColumn()
    id: number;
    @Column({ type: 'varchar', length: 16, nullable: false })
    tag: string;
}