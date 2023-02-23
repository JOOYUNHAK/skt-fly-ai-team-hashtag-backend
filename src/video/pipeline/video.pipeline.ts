import { ObjectId } from "mongodb";

/* 최신 비디오 순 파이프라인 */
export const GetRecentVideoListPipeLine = () => [
    {
        '$project': {
            '_id': 1,
            'nickName': 1,
            'thumbNailPath': 1,
            'title': 1,
            'tags': 1,
            'likeCount': 1,
            'uploadedAt': {
                '$subtract': [
		    Date.now(),
                    '$uploadedAt'
                ]
            },
        }
    },
    { '$sort': { 'uploadedAt': 1 } }
];

/* 인기 비디오 순 파이프라인 */
export const GetHotVideoListPipeLine = [
    { '$sort': { 'likeCount': -1 } },
    { '$limit': 3 },
    {
        '$project': {
            '_id': 1,
            'thumbNailPath': 1,
            'title': 1,
            'tags': 1,
            'likeCount': 1
        }
    }
]

/* 비디오 상세조회 파이프라인 */
export const GetVideoDetailPipeLine = (videoId: string) => {
    return [
        { '$match': { '_id': new ObjectId(videoId) }},
        { '$project': {
            '_id': 1,
            'nickName': 1,
            'title': 1,
            'tags': 1,
            'likeCount': 1,
            'videoPath': 1,
            'uploadedAt': {
                '$subtract': [
                    Date.now(),
                    '$uploadedAt'
                ]
            }
        }}
    ]
}

/* 썸네일 이미지 get 파이프라인 */
export const GetThumbNailPathPipeLine = (userId: string) => {
    return [
        { '$match': { 'userId': userId } }, // 해당 user의 비디오만
        { '$sort': { 'uploadedAt': 1 } }, // 날짜 최신순
        { '$project': { '_id': 1, 'thumbNailPath': 1 } }
    ]
}
