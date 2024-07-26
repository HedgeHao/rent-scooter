import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { Define } from './define'

export type ResponseBase = {
    info: string
    code: Define.ResponseCode.Type
}

export type ResponseDetail<T> = ResponseBase & {
    detail: T
}


export function formatAppResponse<T>(
    res?: Partial<ResponseDetail<T>>
): ResponseDetail<T> {
    return {
        info: res?.info || '',
        code: res?.code || Define.ResponseCode.ok,
        detail: res?.detail || ({} as T)
    }
}

export class ResponseInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
        return next.handle().pipe(map(detail => formatAppResponse({ detail })))
    }
}