import { User } from "./entity/user.entity";

export interface IUserRepository {
    findByPhoneNumber: (phoneNumber: string) => Promise<User>;
    save: (user: User) => Promise<User>;
}