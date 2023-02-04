export const SearchVideoPipeline = (arg: string): Object[] => {
    return [
        {
            '$search': {
                'index': 'search_videos',
                'text': {
                    'query': arg,
                    'path': ['tags', 'title'],
                    'synonyms': 'videoCollectionSynonyms'
                }
            },
            '$project': {
                '_id': 1,
                'nickName': 1,
                'thumbNailPath': 1,
                'title': 1,
                'tags': 1,
                'likeCount': 1,
                'uploadedAt': {
                    '$divide': [
                        {
                            '$subtract': [
                                new Date().getTime(),
                                '$uploadedAt'
                            ]
                        },
                        1000
                    ]
                }
            }
        }
    ];
}