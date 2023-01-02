import { ApiProperty } from "@nestjs/swagger";
import { UserDto } from "../../auth/dto/user.dto";

export class LikeDto {
    @ApiProperty({
        description: '각 추천의 번호(DB에서 AUTO_INCREMENT 값)',
        example: 1
    })
    seq: number;
    @ApiProperty({
        description: '추천을 누른 사용자의 seq(user객체 중 seq 속성)',
        example: 1
    })
    list: number
}