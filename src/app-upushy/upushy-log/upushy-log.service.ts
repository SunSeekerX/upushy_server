/**
 * 日志服务
 * @author: SunSeekerX
 * @Date: 2020-11-03 10:28:06
 * @LastEditors: SunSeekerX
 * @LastEditTime: 2021-09-14 22:20:58
 */

import { Injectable, Inject } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { FindOptionsWhere, ObjectLiteral, Repository } from 'typeorm'

import { LoginLogEntity, UpdateLogEntity, DeviceInfoLogEntity } from './entities'
import { DEVICE_INFO_LOG_REPOSITORY, LOGIN_LOG_REPOSITORY, UPDATE_LOG_REPOSITORY } from 'src/app-shared/constant'
import { CreateLoginLogDto, QueryLoginLogDto, CreateDeviceInfoLogDto, CreateUpdateLogDto } from './dto'

@Injectable()
export class UpushyLogService {
  constructor(
    // @Inject(LOGIN_LOG_REPOSITORY)
    // private loginLogRepo: Repository<LoginLogEntity>,
    // @Inject(DEVICE_INFO_LOG_REPOSITORY)
    // private deviceInfoLogRepo: Repository<DeviceInfoLogEntity>,
    // @Inject(UPDATE_LOG_REPOSITORY)
    // private updateLogRepo: Repository<UpdateLogEntity>,

    @InjectRepository(LoginLogEntity)
    private readonly loginLogRepo: Repository<LoginLogEntity>,
    @InjectRepository(DeviceInfoLogEntity)
    private readonly deviceInfoLogRepo: Repository<DeviceInfoLogEntity>,
    @InjectRepository(UpdateLogEntity)
    private readonly updateLogRepo: Repository<UpdateLogEntity>
  ) {}

  /**
   * @name login
   */
  // 创建登录记录
  async createLoginLog(createLogLoginDto: CreateLoginLogDto): Promise<LoginLogEntity> {
    const loginLog = new LoginLogEntity()
    Object.assign(loginLog, createLogLoginDto)
    return await this.loginLogRepo.save(loginLog)
  }

  // 分页查询登录记录
  async queryLoginLog(
    { id, pageNum, pageSize }: QueryLoginLogDto,
    orderCondition: {
      [P in keyof LoginLogEntity]?: 'ASC' | 'DESC' | 1 | -1
    }
  ): Promise<LoginLogEntity[]> {
    const conditions: FindOptionsWhere<LoginLogEntity>[] | FindOptionsWhere<LoginLogEntity> | ObjectLiteral | string =
      {}

    id && (conditions.id = id)
    return await this.loginLogRepo.find({
      where: conditions,
      take: pageSize,
      skip: (pageNum - 1) * pageSize,
      order: orderCondition,
    })
  }

  // 查询所有登录记录
  async findAllLoginLog(): Promise<LoginLogEntity[]> {
    return await this.loginLogRepo.find()
  }

  // 获取登录记录总数
  async getLoginLogCount(): Promise<number> {
    return await this.loginLogRepo.count()
  }

  /**
   * @name update
   */
  // 创建设备记录
  async createDeviceInfoLog(createLogDeviceInfoDto: CreateDeviceInfoLogDto): Promise<DeviceInfoLogEntity> {
    const deviceInfoLog = new DeviceInfoLogEntity()
    Object.assign(deviceInfoLog, createLogDeviceInfoDto)
    return await this.deviceInfoLogRepo.save(deviceInfoLog)
  }

  // 查询单个设备记录
  async querySingleDeviceInfo(
    // where: FindOneOptions<DeviceInfoLogEntity>,
    where: FindOptionsWhere<DeviceInfoLogEntity>
  ): Promise<DeviceInfoLogEntity | null> {
    return await this.deviceInfoLogRepo.findOne({
      where,
    })
  }

  // 创建检查更新记录
  async createUpdateLog(createLogUpdateDto: CreateUpdateLogDto): Promise<UpdateLogEntity> {
    const updateLog = new UpdateLogEntity()
    Object.assign(updateLog, createLogUpdateDto)
    return await this.updateLogRepo.save(updateLog)
  }
}
