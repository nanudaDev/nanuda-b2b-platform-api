import {
  Injectable,
  CacheOptionsFactory,
  CacheModuleOptions,
} from '@nestjs/common';

@Injectable()
export class CacheConfigService implements CacheOptionsFactory {
  createCacheOptions(): CacheModuleOptions {
    // no cache settings if not production
    // return 30* for get = > look at src/core/interceptor/http-cache.interceptor.ts
    // if (process.env.NODE_ENV !== 'production') {
    //   return {};
    // }
    // console.log('test');
    return {
      ttl: 5,
      max: 100,
    };
  }
}
