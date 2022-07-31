import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { AppAuthService } from './app-auth.service'
import { AppAuthController } from './app-auth.controller'
import { UserPermissionEntity } from './entities'

@Module({
  imports: [TypeOrmModule.forFeature([UserPermissionEntity])],
  controllers: [AppAuthController],
  providers: [AppAuthService],
  exports: [AppAuthService],
})
export class AppAuthModule {}
