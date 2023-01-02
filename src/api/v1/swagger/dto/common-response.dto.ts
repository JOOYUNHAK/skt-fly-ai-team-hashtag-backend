import { ApiProperty } from "@nestjs/swagger";

export class CommonResponseDto {
    @ApiProperty({
        example: '상태코드',
        description: 'Http Status Code'
    })
    statusCode: number;
    @ApiProperty({
        example: 'string',
        description: '요청 별 응답 message'
    })
    message: string
}