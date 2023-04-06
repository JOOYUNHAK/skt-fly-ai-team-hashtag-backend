import { PickType } from '@nestjs/swagger';
import { User } from '../../../user/entity/user.entity';

export class LoginRequestDto extends PickType(User, [
    'phoneNumber', 'nickName'
]) {}