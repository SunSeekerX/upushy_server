/**
 * 日志服务
 * @author: SunSeekerX
 * @Date: 2020-11-03 10:28:06
 * @LastEditors: SunSeekerX
 * @LastEditTime: 2021-09-14 22:20:58
 */

import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { FindOptionsWhere, ObjectLiteral, Repository, MoreThan } from 'typeorm'

import { genSnowFlakeId, dayjs } from 'src/app-shared/utils'
import { LoginLogEntity, UpdateLogEntity, DeviceInfoLogEntity } from './entities'
import { CreateLoginLogDto, QueryLoginLogDto, CreateDeviceInfoLogDto, CreateUpdateLogDto } from './dto'
import { DateStatsItem } from 'src/app-shared/interface'

@Injectable()
export class UpushyLogService {
  constructor(
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
  async onCreateLoginLog(createLogLoginDto: CreateLoginLogDto): Promise<LoginLogEntity> {
    // const result = []
    // for (let i = 0; i < 100; i++) {
    //   const loginLog = new LoginLogEntity()
    //   Object.assign(loginLog, createLogLoginDto)
    //   loginLog.id = genSnowFlakeId()
    //   loginLog.createdTime = dayjs().subtract(i, 'day').toDate()
    //   result[i] = await this.loginLogRepo.save(loginLog)
    // }

    const loginLog = new LoginLogEntity()
    Object.assign(loginLog, createLogLoginDto)
    loginLog.id = genSnowFlakeId()
    loginLog.createdTime = new Date()
    return await this.loginLogRepo.save(loginLog)
  }

  // 分页查询登录记录
  async onFindLoginLogPaging(
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
  async onFindLoginLogAll(): Promise<LoginLogEntity[]> {
    return await this.loginLogRepo.find()
  }

  // 获取登录记录总数
  async onFindLoginLogCount(): Promise<number> {
    return await this.loginLogRepo.count()
  }

  // 获取指定时间段内登录的总次数
  async onFindLoginLogCountByDuration(duration: number = 7): Promise<number> {
    // 今天从零时开始的日期
    const today = new Date(new Date().setHours(0, 0, 0, 0))
    const todayDayjs = dayjs(today)
    // 获取开始的日期
    const startDate = todayDayjs.subtract(duration - 1, 'days').toDate()
    return await this.loginLogRepo.count({
      where: {
        createdTime: MoreThan(startDate),
      },
    })
  }

  // 获取指定天数内的登录次数 包括今天
  async onFindLoginLogByDays(duration: number = 7) {
    // 今天从零时开始的日期
    const today = new Date(new Date().setHours(0, 0, 0, 0))
    const todayDayjs = dayjs(today)
    // 获取开始的日期
    const startDate = todayDayjs.subtract(duration - 1, 'days').toDate()
    // 结果集
    const resultList = {}
    for (let i = 0; i < duration; i++) {
      const flagDate = todayDayjs.subtract(i, 'day').toDate()
      resultList[flagDate.getTime()] = {
        date: flagDate,
        amount: 0,
      }
    }
    const queryResult = await this.loginLogRepo
      .createQueryBuilder('loginLog')
      .select('DATE(DATE_FORMAT( created_time, "%Y-%m-%d" ))', 'date')
      .addSelect('COUNT(*)', 'amount')
      .where('created_time > :startDate', {
        startDate,
      })
      .groupBy('date')
      .orderBy('date')
      .getRawMany<DateStatsItem>()
    for (const item of queryResult) {
      resultList[dayjs(item.date).toDate().getTime()].amount = item?.amount ? Number(item.amount) : 0
    }
    return resultList
  }

  // 创建设备记录
  async onCreateDeviceInfoLog(createLogDeviceInfoDto: CreateDeviceInfoLogDto): Promise<DeviceInfoLogEntity> {
    const deviceInfoLog = new DeviceInfoLogEntity()
    Object.assign(deviceInfoLog, createLogDeviceInfoDto)
    deviceInfoLog.id = genSnowFlakeId()
    deviceInfoLog.createdTime = new Date()
    return await this.deviceInfoLogRepo.save(deviceInfoLog)
  }

  // 查询单个设备记录
  async onFindDeviceInfoOne(
    // where: FindOneOptions<DeviceInfoLogEntity>,
    where: FindOptionsWhere<DeviceInfoLogEntity>
  ): Promise<DeviceInfoLogEntity | null> {
    return await this.deviceInfoLogRepo.findOne({
      where,
    })
  }

  // 创建检查更新记录
  async onCreateUpdateLog(createLogUpdateDto: CreateUpdateLogDto): Promise<UpdateLogEntity> {
    const updateLog = new UpdateLogEntity()
    Object.assign(updateLog, createLogUpdateDto)
    updateLog.id = genSnowFlakeId()
    updateLog.createdTime = new Date()
    return await this.updateLogRepo.save(updateLog)
  }
}
