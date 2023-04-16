import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import { HttpArgumentsHost } from "@nestjs/common/interfaces";
import { HttpAdapterHost } from "@nestjs/core";

@Catch()
export class AllHttpExceptionFilter implements ExceptionFilter {
    constructor( private readonly httpAdapterHost: HttpAdapterHost ) {}
    catch(exception: any, host: ArgumentsHost) {

        const { httpAdapter } = this.httpAdapterHost;
        const ctx = host.switchToHttp();
        let errorResponseBody = createErrorResponseBody(exception, ctx);

        httpAdapter.reply(ctx.getResponse(), errorResponseBody, errorResponseBody.statusCode);
    }
}

function createErrorResponseBody(exception: any, ctx: HttpArgumentsHost) {
    const request = ctx.getRequest();
    let errorResponseBody = {
        value: request.method === 'GET' ?
            ( Object.keys(request.params).length ? 
                request.params : request.query ) : request.body,
        }
    
    // 직접 오는 에러
    if( exception instanceof HttpException ) {
        return {
            statusCode: exception.getStatus(),
            message: exception.message,
            ...errorResponseBody,
            path: request.url
        }
    }

    // 다른 서비스와의 관계에서 발생한 에러
    const httpStatus = exception?.response ?
                        exception.response.data.statusCode :
                            HttpStatus.INTERNAL_SERVER_ERROR
    return {
        statusCode: httpStatus,
        message: httpStatus === 500 ? 
                    '현재 서버와의 통신이 불안정해요' :
                        exception.response.data.message,
        ...errorResponseBody,
        path: httpStatus === 500 ? 
                exception.request._options.pathname : 
                        exception.request.path
    }
}
