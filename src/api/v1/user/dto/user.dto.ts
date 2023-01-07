import { PickType } from "@nestjs/swagger";
import { User } from "../entity/user.entity";

export class UserDto extends PickType(User, [
    'id', 'phoneNumber', 'nickName'
] as const) {}