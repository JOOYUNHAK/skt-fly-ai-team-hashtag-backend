export function createResponse<T,U,M>(data: (T|U|M) []): any {
    const [type, statusCode, message, responseData] = data;
    let response = {
        statusCode,
        message
    };
    if(type === 'login') {
        return {
            ...response,
            'body': {
                'user': {
                    ...responseData
                }
            }
        }
    }
}