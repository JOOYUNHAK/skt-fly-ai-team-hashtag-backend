import { MyFeedResponseDto } from "./my-feed-response.dto";

class CommonResponseDto {
    statusCode: number;
    message: string;
}

export class GetMyFeedResponseDto extends CommonResponseDto {
    body: {
        data: MyFeedResponseDto []
    }
};