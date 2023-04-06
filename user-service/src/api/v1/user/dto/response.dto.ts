import { MyFeedDto } from "./my-feed.dto";

class CommonResponseDto {
    statusCode: number;
    message: string;
}

export class GetMyFeedResponseDto extends CommonResponseDto {
    body: {
        data: MyFeedDto []
    }
};