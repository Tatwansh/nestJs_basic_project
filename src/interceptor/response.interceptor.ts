import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { map, Observable } from 'rxjs';
import { MESSAGE_KEY } from 'src/decorators/custom_response.decorator';

export interface globalResponse {
  Success: boolean;
  message: string;
  data: [];
}
export class ResponeInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data: any) => {
        const message = this.reflector.get<string>(
          MESSAGE_KEY,
          context.getHandler(),
        );
        const responseObject: globalResponse = {
          Success: true,
          message,
          data,
        };
        return responseObject;
      }),
    );
  }
}
