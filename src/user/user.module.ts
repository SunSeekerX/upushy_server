/**
 * @name:
 * @author: SunSeekerX
 * @Date: 2020-06-25 23:07:16
 * @LastEditors: SunSeekerX
 * @LastEditTime: 2020-10-28 00:53:37
 */

import { Module, NestModule, MiddlewareConsumer, Global } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { UserService } from './user.service'
import { UserController } from './user.controller'
import { UserEntity } from './user.entity'

// import { AuthMiddleware } from 'src/shared/middleware/auth.middleware'
import { SignMiddleware } from 'src/shared/middleware/sign.middleware'

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(SignMiddleware).forRoutes(UserController)
  }
}
