/**
 * @name:
 * @author: SunSeekerX
 * @Date: 2020-10-28 00:04:03
 * @LastEditors: SunSeekerX
 * @LastEditTime: 2020-10-28 23:01:17
 */

import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { FindConditions, ObjectLiteral, Repository } from 'typeorm'
import { CreateLoginLogDto } from './dto/create-login-log.dto'
import { QueryLoginLogDto } from './dto/query-login-log.dto'
import { LoginLogEntity } from './entity/login.log.entity'

@Injectable()
export class BasicService {
  constructor(
    @InjectRepository(LoginLogEntity)
    private readonly loginLogRepository: Repository<LoginLogEntity>,
  ) {}

  // 创建登录记录
  async createLoginLog({
    username,
    ipaddr,
    loginLocation,
    browser,
    os,
    status,
    msg,
    loginTime,
  }: CreateLoginLogDto): Promise<LoginLogEntity> {
    const loginLog = new LoginLogEntity()
    loginLog.username = username
    loginLog.ipaddr = ipaddr
    loginLog.loginLocation = loginLocation
    loginLog.browser = browser
    loginLog.os = os
    loginLog.status = status
    loginLog.msg = msg
    loginLog.loginTime = loginTime

    const savedLoginLog = await this.loginLogRepository.save(loginLog)
    return savedLoginLog
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
}
