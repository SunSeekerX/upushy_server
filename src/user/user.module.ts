/**
 * @name:
 * @author: SunSeekerX
 * @Date: 2020-06-25 23:07:16
 * @LastEditors: SunSeekerX
 * @LastEditTime: 2021-09-14 17:48:38
 */

import { Module, NestModule, MiddlewareConsumer, Global, CacheModule } from '@nestjs/common'
import * as redisStore from 'cache-manager-redis-store'
import { TypeOrmModule } from '@nestjs/typeorm'

import { getEnv } from 'src/app-shared/config'

import { UserService } from './user.service'
import { UserController } from './user.controller'
import { UserEntity } from './entities'

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    CacheModule.register({
      store: redisStore,
      host: getEnv('REDIS_HOST'),
      port: getEnv('REDIS_PORT'),
      auth_pass: getEnv('REDIS_PASSWORD'),
      db: getEnv('REDIS_DB'),
    }),
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
