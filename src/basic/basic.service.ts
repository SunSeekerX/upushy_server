/**
 * @name:
 * @author: SunSeekerX
 * @Date: 2020-10-28 00:04:03
 * @LastEditors: SunSeekerX
 * @LastEditTime: 2020-10-28 00:51:51
 */

import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateLoginLogDto } from './dto/create-login-log.dto'
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
}
