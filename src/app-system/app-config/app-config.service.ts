import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import type { UpdateResult } from 'typeorm'
import { Repository } from 'typeorm'

import { genSnowFlakeId } from 'src/app-shared/utils'

import { ConfigEntity } from './entities'
import type { UserEntity } from 'src/app-system/app-user/entities'
import type { ModifyConfigDto } from './dto'

@Injectable()
export class AppConfigService {
  constructor(
    @InjectRepository(ConfigEntity)
    private readonly configRepo: Repository<ConfigEntity>
  ) {}

  // 创建系统配置
  async onCreateConfig(requestUser: UserEntity, modifyConfigDto: ModifyConfigDto): Promise<ConfigEntity> {
    const newConfig = new ConfigEntity()
    newConfig.id = genSnowFlakeId()
    newConfig.createdBy = requestUser.id
    newConfig.createdTime = new Date()
    newConfig.configKey = modifyConfigDto.configKey
    newConfig.configValue = modifyConfigDto.configValue
    return await this.configRepo.save(newConfig)
  }

  // 更新系统配置
  async onUpdateConfig(requestUser: UserEntity, modifyConfigDto: ModifyConfigDto): Promise<UpdateResult> {
    return await this.configRepo.update(
      {
        configKey: modifyConfigDto.configKey,
      },
      {
        configValue: modifyConfigDto.configValue,
      }
    )
  }
}
