import { AutoMap } from "@automapper/classes";

export class UserDto {
    @AutoMap()
    readonly id: number;
    @AutoMap()
    readonly phoneNumber: string;
    @AutoMap()
    readonly nickName: string;
}