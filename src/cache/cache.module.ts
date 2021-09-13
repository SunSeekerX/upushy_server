/**
 * 缓存模块
 * @author: SunSeekerX
 * @Date: 2021-09-13 22:40:25
 * @LastEditors: SunSeekerX
 * @LastEditTime: 2021-09-13 22:42:47
 */

import { Module, Global, CacheModule as CacheModuleNest } from '@nestjs/common'
import * as redisStore from 'cache-manager-redis-store'
import { CacheService } from './cache.service'

import { getEnv } from 'src/shared/config'
import { EnvType } from 'src/shared/enums'

@Global()
@Module({
  imports: [
    CacheModuleNest.register({
      store: redisStore,
      host: getEnv('REDIS_HOST', EnvType.string),
      port: getEnv('REDIS_PORT', EnvType.number),
      auth_pass: getEnv('REDIS_PASSWORD', EnvType.string),
      db: getEnv('REDIS_DB', EnvType.number),
    }),
  ],
  providers: [CacheService],
  exports: [CacheService],
})
export class CacheModule {}
