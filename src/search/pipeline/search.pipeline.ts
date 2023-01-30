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
            }
        }
    ];
}