import { Module, Global, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { TokenAuthMiddleware } from 'src/app-shared/middleware'
import { AppUserService } from './app-user.service'
import { AppUserController } from './app-user.controller'
import { UserEntity } from './entities'

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [AppUserService],
  controllers: [AppUserController],
  exports: [AppUserService],
})
export class AppUserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TokenAuthMiddleware).forRoutes(AppUserController)
  }
}
