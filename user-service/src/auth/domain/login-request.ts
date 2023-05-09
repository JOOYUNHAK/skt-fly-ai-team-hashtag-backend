import { AutoMap } from "@automapper/classes";

export class LoginRequest {
    @AutoMap()
    readonly phoneNumber: string;
    @AutoMap()
    readonly nickName: string;
}