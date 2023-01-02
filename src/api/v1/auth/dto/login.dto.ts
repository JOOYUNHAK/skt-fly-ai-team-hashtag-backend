import { ApiProperty, PickType } from '@nestjs/swagger';
import { User } from '../../user/entity/user.entity';

export class LoginDto extends PickType(User, [
    'id', 'nickname'
] as const) {}