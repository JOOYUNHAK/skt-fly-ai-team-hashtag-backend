/* 최신 비디오 순 파이프라인 */
export const GetRecentVideoListPipeLine = [
    { '$sort': { '_id': -1 } },
    {
        '$project': {
            '_id': 1,
            'nickName': 1,
            'imagePath': 1,
            'title': 1,
            'tags': 1,
            'likeCount': 1,
            'uploadedAt': 1
        }
    },
];

/* 인기 비디오 순 파이프라인 */
export const GetHotVideoListPipeLine = [
    { '$limit': 3 },
    {
        '$project': {
            '_id': 1,
            'imagePath': 1,
            'title': 1,
            'tags': 1,
            'likeCount': 1
        }
    }
]