/**
 * 缓存服务
 * @author: SunSeekerX
 * @Date: 2021-09-13 22:40:51
 * @LastEditors: SunSeekerX
 * @LastEditTime: 2021-09-13 22:48:05
 */

import { Injectable, Inject, CACHE_MANAGER } from '@nestjs/common'
import { Cache } from 'cache-manager'

@Injectable()
export class AppCacheService {
  public INSTANCE: Cache

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {
    this.INSTANCE = this.cacheManager
  }
}
