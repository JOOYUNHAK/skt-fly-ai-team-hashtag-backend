import { ApiProperty } from "@nestjs/swagger";
import { CommonResponseDto } from "../../../swagger/dto/common-response.dto";
import { UserDto } from "../../../user/dto/user.dto";

class LoginResponseData {
    @ApiProperty()
    user: UserDto
}

export class LoginResponseDto extends CommonResponseDto {
    @ApiProperty()
    body: LoginResponseData
}