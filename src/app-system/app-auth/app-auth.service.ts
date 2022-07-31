import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { genSnowFlakeId } from 'src/app-shared/utils'
import { CreateUserPermissionDto } from './dto/create-user-permission.dto'

import { UserPermissionEntity } from './entities'

@Injectable()
export class AppAuthService {
  constructor(
    @InjectRepository(UserPermissionEntity)
    private readonly userPermissionRepo: Repository<UserPermissionEntity>
  ) {}

  // 创建用户权限
  async onCreateUserPermission(createUserPermissionDto: CreateUserPermissionDto): Promise<UserPermissionEntity> {
    const newUserPermission = new UserPermissionEntity()
    newUserPermission.id = genSnowFlakeId()
    newUserPermission.userId = createUserPermissionDto.userId
    newUserPermission.createdBy = createUserPermissionDto.userId
    newUserPermission.createdTime = new Date()
    newUserPermission.permission = createUserPermissionDto.permission
    return await this.userPermissionRepo.save(newUserPermission)
  }

  // 根据用户 id 获取用户权限
  async onFindUserPermissionByUserId(userId: string): Promise<UserPermissionEntity | null> {
    return await this.userPermissionRepo.findOne({
      where: {
        userId: userId,
      },
    })
  }
}
