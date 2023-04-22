import { AutoMap } from "@automapper/classes";

export class RegisterUserDto {
    @AutoMap()
    readonly phoneNumber: string;
    @AutoMap()
    readonly nickName: string;
}