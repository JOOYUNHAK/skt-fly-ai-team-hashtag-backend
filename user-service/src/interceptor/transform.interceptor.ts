import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { map, Observable, reduce, tap } from "rxjs";
import { UserServiceResponse } from "src/interface/response-with-data.interface";

@Injectable()
export class ResponseTransformInterceptor<T> implements NestInterceptor<UserServiceResponse<T>> {
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<UserServiceResponse<T>> {
        const nextHandler = next.handle();

        return nextHandler
            .pipe (
                map(responseData => ({ user: (!responseData || !responseData.length) ? null : responseData }))
            )
        }
}