import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity, PrimaryColumn } from "typeorm";
import { v1 as uuidv1 } from "uuid";
import { LoginRequestDto } from "../../auth/login/dto/login-requestdto";
@Entity({ name: 'user' })
export class User {
    @ApiProperty({
        example: '011d8eebc58e0a7d796690800200c9a66',
        description: '사용자가 생성될 때마다 부여되는 ordered uuid값'
    })
    @PrimaryColumn({ 
        type: 'binary', 
        length: 16,
    })
    id: string;

    @ApiProperty({
        example: '01024893797',
        description: '해당 사용자의 핸드폰 번호'
    })
    @Column({ type: 'varchar', length: 11, nullable: false, name: 'phone_number' })
    phoneNumber: string;

    @ApiProperty({
        example: '해시태그',
        description: '해당 사용자의 닉네임'
    })
    @Column({ type: 'varchar', length: 20, nullable: false, name: 'nickname' })
    nickName: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
    createdAt: Date

    static createOrderedUuid() {
        const uuid = uuidv1();
        const orderedUuid = uuid.split('-');
        return orderedUuid[2] + orderedUuid[1] + 
            orderedUuid[0] + orderedUuid[3] + orderedUuid[4];
    } 

    static registerNewUser(loginDto: LoginRequestDto) {
        const user = new User();
        user.phoneNumber = loginDto.phoneNumber;
        user.nickName = loginDto.nickName;
        return user;     
    }
}