export function createResponse<T>(data: (String|Number|T) []): any {
    const [type, statusCode, message, responseData] = data;
    let response = {
        statusCode,
        message
    };
    if(type === 'login') {
        return {
            ...response,
            'body': {
                'user': responseData[0]
            }
        }
    }
}