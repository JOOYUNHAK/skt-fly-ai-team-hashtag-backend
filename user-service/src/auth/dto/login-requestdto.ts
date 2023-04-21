import { AutoMap } from "@automapper/classes";

export class LoginRequestDto {
    @AutoMap()
    private phoneNumber: string;
    @AutoMap()
    private nickName: string;

    getPhoneNumber() { return this.phoneNumber; }
    getNickName() { return this.nickName; }
}