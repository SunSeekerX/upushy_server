/**
 * @name:
 * @author: SunSeekerX
 * @Date: 2020-06-25 23:07:16
 * @LastEditors: SunSeekerX
 * @LastEditTime: 2021-09-14 00:34:49
 */

import { Module, NestModule, MiddlewareConsumer, Global, CacheModule } from '@nestjs/common'
import * as redisStore from 'cache-manager-redis-store'
import { TypeOrmModule } from '@nestjs/typeorm'

import { getEnv } from 'src/shared/config'
import { EnvType } from 'src/shared/enums'

import { UserService } from './user.service'
import { UserController } from './user.controller'
import { UserEntity } from './user.entity'

// import { AuthMiddleware } from 'src/shared/middleware/auth.middleware'
import { SignMiddleware } from 'src/shared/middleware/sign.middleware'

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    CacheModule.register({
      store: redisStore,
      host: getEnv('REDIS_HOST', EnvType.string),
      port: getEnv('REDIS_PORT', EnvType.number),
      auth_pass: getEnv('REDIS_PASSWORD', EnvType.string),
      db: getEnv('REDIS_DB', EnvType.number),
    }),
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
// export class UserModule implements NestModule {
//   configure(consumer: MiddlewareConsumer): void {
//     consumer.apply(SignMiddleware).forRoutes(UserController)
//   }
// }
export class UserModule {}
