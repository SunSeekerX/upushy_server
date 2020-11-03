/**
 * @name:
 * @author: SunSeekerX
 * @Date: 2020-11-03 10:28:06
 * @LastEditors: SunSeekerX
 * @LastEditTime: 2020-11-03 15:19:10
 */
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import {
  FindConditions,
  ObjectLiteral,
  Repository,
} from 'typeorm'

import {
  LoginLogEntity,
  UpdateLogEntity,
  DeviceInfoLogEntity,
} from './entity/index'
import {
  CreateLoginLogDto,
  QueryLoginLogDto,
  CreateDeviceInfoLogDto,
  CreateUpdateLogDto,
} from './dto/index'

@Injectable()
export class LogService {
  constructor(
    @InjectRepository(LoginLogEntity)
    private readonly loginLogRepository: Repository<LoginLogEntity>,
    @InjectRepository(DeviceInfoLogEntity)
    private readonly deviceInfoLogRepository: Repository<DeviceInfoLogEntity>,
    @InjectRepository(UpdateLogEntity)
    private readonly updateLogRepository: Repository<UpdateLogEntity>,
  ) {}

  /**
   * @name login
   */
  // 创建登录记录
  async createLoginLog(
    createLogLoginDto: CreateLoginLogDto,
  ): Promise<LoginLogEntity> {
    const loginLog = new LoginLogEntity()
    Object.assign(loginLog, createLogLoginDto)
    return await this.loginLogRepository.save(loginLog)
  }

  // 分页查询登录记录
  async queryLoginLog(
    { id, pageNum, pageSize }: QueryLoginLogDto,
    orderCondition: {
      [P in keyof LoginLogEntity]?: 'ASC' | 'DESC' | 1 | -1
    },
  ): Promise<LoginLogEntity[]> {
    const conditions:
      | FindConditions<LoginLogEntity>[]
      | FindConditions<LoginLogEntity>
      | ObjectLiteral
      | string = {}

    id && (conditions.id = id)
    return await this.loginLogRepository.find({
      where: conditions,
      take: pageSize,
      skip: (pageNum - 1) * pageSize,
      order: orderCondition,
    })
  }

  // 查询所有登录记录
  async findAllLoginLog(): Promise<LoginLogEntity[]> {
    return await this.loginLogRepository.find()
  }

  // 获取登录记录总数
  async getLoginLogCount(): Promise<number> {
    return await this.loginLogRepository.count()
  }

  /**
   * @name update
   */
  // 创建设备记录
  async createDeviceInfoLog(
    createLogDeviceInfoDto: CreateDeviceInfoLogDto,
  ): Promise<DeviceInfoLogEntity> {
    const deviceInfoLog = new DeviceInfoLogEntity()
    Object.assign(deviceInfoLog, createLogDeviceInfoDto)
    return await this.deviceInfoLogRepository.save(deviceInfoLog)
  }

  // 查询单个设备记录
  async querySingleDeviceInfo(
    // where: FindOneOptions<DeviceInfoLogEntity>,
    where: FindConditions<DeviceInfoLogEntity>,
  ): Promise<DeviceInfoLogEntity | null> {
    return await this.deviceInfoLogRepository.findOne({
      where,
    })
  }

  // 创建检查更新记录
  async createUpdateLog(
    createLogUpdateDto: CreateUpdateLogDto,
  ): Promise<UpdateLogEntity> {
    const updateLog = new UpdateLogEntity()
    Object.assign(updateLog, createLogUpdateDto)
    return await this.updateLogRepository.save(updateLog)
  }
}
