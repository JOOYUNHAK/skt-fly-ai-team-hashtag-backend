import { Injectable } from "@nestjs/common";
import { User } from "../domain/entity/user.entity";
import { UserRepository } from "../infra/database/user.repository";
import { LoginRequest } from "src/auth/domain/login-request";
import { InjectMapper } from "@automapper/nestjs";
import { Mapper } from "@automapper/core";

@Injectable()
export class UserService {
    constructor(
        @InjectMapper()
        private readonly mapper: Mapper,
        private readonly userRepository: UserRepository
    ) {}
    async findUserByPhoneNumber(phoneNumber: string): Promise<User | null> {
        return await this.userRepository.findByPhoneNumber(phoneNumber);
    }

    async register(registerInfo: LoginRequest): Promise<User> {
        return await this.userRepository.save(this.mapper.map(registerInfo, LoginRequest, User));
    }
}