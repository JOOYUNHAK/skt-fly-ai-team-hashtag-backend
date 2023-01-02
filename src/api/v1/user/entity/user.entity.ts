import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'user' })
export class User {
    @ApiProperty({
        example: 1,
        description: '해당 사용자에 해당되는 AUTO_INCREMENT ID'
    })
    @PrimaryGeneratedColumn('increment')
    seq: number;

    @ApiProperty({
        example: '01024893797',
        description: '해당 사용자의 핸드폰 번호'
    })
    @Column({ type: 'varchar', length: 11, nullable: false })
    id: string;

    @ApiProperty({
        example: '해시태그',
        description: '해당 사용자의 닉네임'
    })
    @Column({ type: 'varchar', length: 20, nullable: false })
    nickname: string;

    @Column({ type: 'timestamp' })
    createdAt: Date
}