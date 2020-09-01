import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { classToPlain } from 'class-transformer';

@Injectable()
export class ExcludeClassToPlainInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, call$): Observable<any> {
    return call$.pipe(map(data => classToPlain(data)));
  }
}
