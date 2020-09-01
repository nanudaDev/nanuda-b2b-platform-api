import { Injectable, CacheInterceptor, ExecutionContext } from '@nestjs/common';

@Injectable()
export class HttpCacheInterceptor extends CacheInterceptor {
  trackBy(context: ExecutionContext): string | undefined {
    const req = context.switchToHttp().getRequest();
    if (!req) {
      return undefined;
    }
    const httpServer = this.httpAdapterHost.httpAdapter;
    const isGetRequest = httpServer.getRequestMethod(req) === 'GET';
    const excludePaths = [];
    if (
      !isGetRequest ||
      (isGetRequest && excludePaths.includes(httpServer.getRequestUrl))
    ) {
      return undefined;
    }
    return httpServer.getRequestUrl(req);
  }
}
