import { AutoMap } from "@automapper/classes";

export class LoginRequestDto {
    @AutoMap()
    readonly phoneNumber: string;
    @AutoMap()
    readonly nickName: string;
}