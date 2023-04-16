import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { map, Observable, reduce } from "rxjs";
import { ResponseWithData } from "src/common/interface/common-response.interface";

@Injectable()
export class ResponseTransformInterceptor<T> implements NestInterceptor<ResponseWithData<T>> {
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<ResponseWithData<T>> {
        
        const exceptRouterList = ['/api/v1/video/detail/:videoId']; // except router
        const router = context.switchToHttp().getRequest().route.path; // request path
        const nextHandler = next.handle();

        if( exceptRouterList.indexOf(router) == -1 ) {
            return nextHandler
                    .pipe( 
                        map( responseData => ({ 
                            data: (!responseData || !responseData.length) ? null : responseData }) 
                        )
                    )
        }
        return nextHandler
                    .pipe(
                        reduce((totalData, responseData) => ({ ...totalData, ...responseData }), {}),
                        map(responseData => ({ data: responseData }))
                    )
        }
}