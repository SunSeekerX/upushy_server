import { Module, Global, CacheModule } from '@nestjs/common'
import type { CacheModuleOptions } from '@nestjs/common'
import * as redisStore from 'cache-manager-redis-store'

import { AppCacheService } from './app-cache.service'
import { getEnv } from 'src/app-shared/config'

const cacheModuleOptions: CacheModuleOptions = {
  store: 'memory',
  ttl: 5,
  max: 100,
}

if (getEnv('IS_USING_REDIS')) {
  Object.assign(cacheModuleOptions, {
    store: redisStore,
    host: getEnv('REDIS_HOST'),
    port: getEnv('REDIS_PORT'),
    auth_pass: getEnv('REDIS_PASSWORD'),
    db: getEnv('REDIS_DB'),
    isGlobal: true,
  })
}

@Global()
@Module({
  imports: [CacheModule.register(cacheModuleOptions)],
  providers: [AppCacheService],
  exports: [AppCacheService],
})
export class AppCacheModule {}
