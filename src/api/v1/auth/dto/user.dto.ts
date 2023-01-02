import { PickType } from "@nestjs/swagger";
import { User } from "../../user/entity/user.entity";

export class UserDto extends PickType(User, [
    'seq', 'id', 'nickname'
] as const){}