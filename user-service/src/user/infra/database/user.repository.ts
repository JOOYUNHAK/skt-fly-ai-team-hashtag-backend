import { Inject, Injectable } from "@nestjs/common";
import { IUserRepository } from "src/user/domain/iuser.repository";
import { User } from "src/user/domain/entity/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class UserRepository implements IUserRepository {
    constructor(
        @Inject('USER_REPOSITORY')
        private readonly userRepository: Repository<User>
    ){}
    
    async findByPhoneNumber(phoneNumber: string): Promise<User | null> {
        return await this.userRepository
                            .createQueryBuilder()
                            .where('phone_number = :phoneNumber', { phoneNumber })
                            .getOne();
    }

    async save(user: User): Promise<User> {
        return await this.userRepository.save(user);
    }

    async findNickNameById(id: number): Promise<string> {
        return await this.userRepository
                            .createQueryBuilder()
                            .select('nickname', 'nickName')
                            .where('id = :id', { id })
                            .getRawOne();
    }
}