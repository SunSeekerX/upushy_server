import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { AppConfigService } from './app-config.service'
import { AppConfigController } from './app-config.controller'
import { ConfigEntity } from './entities'

@Module({
  imports: [TypeOrmModule.forFeature([ConfigEntity])],
  controllers: [AppConfigController],
  providers: [AppConfigService],
  exports: [AppConfigService],
})
export class AppConfigModule {}
