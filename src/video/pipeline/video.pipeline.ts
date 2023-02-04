import { ObjectId } from "mongodb";

/* 최신 비디오 순 파이프라인 */
export const GetRecentVideoListPipeLine = [
    {
        "$project": {
            "_id": 1,
            "nickName": 1,
            "thumbNailPath": 1,
            "title": 1,
            "tags": 1,
            "likeCount": 1,
            "uploadedAt": {
                "$divide": [
                    {
                        "$subtract": [
                            new Date().getTime(),
                            "$uploadedAt"
                        ]
                    },
                    1000
                ]
            }
        }
    },
    { "$sort": { "$uploadedAt": 1 }}
];

/* 인기 비디오 순 파이프라인 */
export const GetHotVideoListPipeLine = [
    { $sort: { likeCount: -1 } },
    { $skip: 3 },
    {
        $project: {
            _id: 1,
            thumbNailPath: 1,
            title: 1,
            tags: 1,
            likeCount: 1
        }
    }
]

/* 썸네일 이미지 get 파이프라인 */
export const GetThumbNailPathPipeLine = (userId: string) => {
    return [
        { '$match': { 'owner': userId } }, // 해당 user의 비디오만
        { '$sort': { 'uploadedAt': 1 } }, // 날짜 최신순
        { '$project': { _id: 1, thumbNailPath: 1 } }
    ]
}