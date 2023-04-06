import { CommonResponseDto } from "src/common/common-response.dto";

export class LoginResponseDto extends CommonResponseDto {
    body: {
        user: {
            id: string;
            phoneNumber: string;
            nickName: string;
        }
    }
};