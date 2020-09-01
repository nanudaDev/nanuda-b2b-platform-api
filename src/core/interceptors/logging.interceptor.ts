import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const contextName = context.getClass().name;
    Logger.debug('Before...', ...contextName);

    const req = context.switchToHttp().getRequest();

    if (req) {
      Logger.debug(`${req.method} ${req.originalUrl}`, contextName);
      Logger.debug(`params: ${JSON.stringify(req.params)}`, contextName);
      Logger.debug(`query: ${JSON.stringify(req.query)}`, contextName);
      Logger.debug(`body: ${JSON.stringify(req.body)}`, contextName);
    }

    const now = Date.now();
    return next
      .handle()
      .pipe(
        tap(() => Logger.debug(`After... ${Date.now() - now}ms`, contextName)),
      );
  }
}
