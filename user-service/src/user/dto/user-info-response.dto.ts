import { LikeListResponse } from "../query/get-user-info-query.handler";

export class UserInfoResponseDto {
    readonly id: string;
    readonly nickName: string;
    videoLikeList: LikeListResponse
}