import { Module, Global, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { AppUserService } from './app-user.service'
import { AppUserController } from './app-user.controller'
import { UserEntity } from './entities'
import { TokenAuthMiddleware } from 'src/app-shared/middleware'
import { AppAuthModule } from 'src/app-system/app-auth/app-auth.module'

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), AppAuthModule],
  providers: [AppUserService],
  controllers: [AppUserController],
  exports: [AppUserService],
})
export class AppUserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TokenAuthMiddleware).forRoutes(AppUserController)
  }
}
