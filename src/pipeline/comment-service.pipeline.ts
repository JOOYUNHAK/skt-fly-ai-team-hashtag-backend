export const GetVideoCommentsPipeLine = (videoId: string) => [
    { "$match": { 'videoId': videoId}},
    {
        "$project": {
            "_id": 1,
            "nickName": 1,
            "content": 1,
            "uploadedAt": {
                "$subtract": [
                    Date.now(),
                    "$uploadedAt"
                ]
            }
        }
    },
    { "$sort": { "uploadedAt": 1 } }
]