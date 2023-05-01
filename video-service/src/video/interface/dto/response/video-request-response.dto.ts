class CommonVideoOkResponse {
    statusCode: number;
    message: string;
}


export class GetVideoListResponseDto extends CommonVideoOkResponse {
    body: {
        data: {
            hot: object[],
            recent: object[]
        }
    }
}

/* 사용자가 MyFeed 요청했을 때 thumbNailPath response */
export class GetThumbNailPathResponseDto extends CommonVideoOkResponse {
    body: {
        data: [
            {
                videoId: string,
                thumbNailPath: string
            }
        ]
    }
}