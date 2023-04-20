export class LoginRequestDto {
    private phoneNumber: string;
    private nickName: string;

    getPhoneNumber(){ return this.phoneNumber; }

    getNickName() { return this.nickName; }
}