import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { LoginResponseDto } from '../auth/dto/login-response.dto';
import { LoginDto } from '../auth/dto/login.dto';
import { UserDto } from './dto/user.dto';
import { User } from './entity/user.entity';

@Injectable()
export class UserService {
    constructor(
        @Inject('USER_REPOSITORY')
        private readonly userRepository: Repository<User>
    ) {}

    /* DB에서 id로 사용자 찾기 */
    async findUser(id: string): Promise<UserDto> {
        return await this.userRepository
            .createQueryBuilder()
            .select('seq')
            .where('id = :id', { id: id })
            .getRawOne()
    }

    /* 신규 가입*/
    async registerUser(loginDto: LoginDto): Promise<LoginResponseDto> {
        const newUser = await this.userRepository.save(
            User.registerNewUser(loginDto)
        );

        delete newUser.created_at;
        
        return {
            'statusCode': 200,
            'message': '신규 사용자 로그인',
            'body': {
                'user': {
                    ...newUser
                }
            } 
        }
    }
}
