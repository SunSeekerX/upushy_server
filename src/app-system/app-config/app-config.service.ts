import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import type { UpdateResult } from 'typeorm'
import { Repository } from 'typeorm'

import { genSnowFlakeId } from 'src/app-shared/utils'

import { AppConfigEntity } from './entities'
import type { UserEntity } from 'src/app-system/app-user/entities'
import type { ModifyAppConfigDto } from './dto'

@Injectable()
export class AppConfigService {
  constructor(
    @InjectRepository(AppConfigEntity)
    private readonly appConfigRepo: Repository<AppConfigEntity>
  ) {}

  // 创建系统配置
  async onCreateAppConfig(requestUser: UserEntity, modifyConfigDto: ModifyAppConfigDto): Promise<AppConfigEntity> {
    const newConfig = new AppConfigEntity()
    newConfig.id = genSnowFlakeId()
    newConfig.createdBy = requestUser.id
    newConfig.createdTime = new Date()
    newConfig.configKey = modifyConfigDto.configKey
    newConfig.configValue = modifyConfigDto.configValue
    return await this.appConfigRepo.save(newConfig)
  }

  // 更新系统配置
  async onUpdateAppConfig(requestUser: UserEntity, modifyConfigDto: ModifyAppConfigDto): Promise<UpdateResult> {
    return await this.appConfigRepo.update(
      {
        configKey: modifyConfigDto.configKey,
      },
      {
        configValue: modifyConfigDto.configValue,
        updatedBy: requestUser.id,
        updatedTime: new Date(),
      }
    )
  }

  // 获取所有系统配置
  async onFindAppConfigAll(): Promise<AppConfigEntity[]> {
    return this.appConfigRepo.find()
  }

  // 根据配置键名获取系统配置
  async onFindAppConfigByKey(configKey: string): Promise<AppConfigEntity | null> {
    return this.appConfigRepo.findOne({
      where: {
        configKey,
      },
    })
  }
}
