/**
 * @name:
 * @author: SunSeekerX
 * @Date: 2020-10-28 00:04:03
 * @LastEditors: SunSeekerX
 * @LastEditTime: 2020-10-28 17:13:49
 */

import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
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
  async queryLoginLog({
    id,
    pageNum,
    pageSize,
  }: QueryLoginLogDto): Promise<LoginLogEntity[]> {
    return await this.loginLogRepository.find({
      where: {
        id,
      },
      take: pageSize,
      skip: (pageNum - 1) * pageSize,
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
