import { Module, Global } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

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
export class AppUserModule {}
