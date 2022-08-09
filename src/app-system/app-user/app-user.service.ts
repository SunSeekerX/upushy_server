/**
 * @name:
 * @author: SunSeekerX
 * @Date: 2020-06-25 23:08:07
 * @LastEditors: SunSeekerX
 * @LastEditTime: 2021-09-14 17:50:38
 */

import { Injectable, HttpException, HttpStatus, BadRequestException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, DeleteResult, UpdateResult } from 'typeorm'
import type { FindOneOptions } from 'typeorm'

import { validate } from 'class-validator'
import * as jwt from 'jsonwebtoken'
import * as argon2 from 'argon2'

import { genSnowFlakeId } from 'src/app-shared/utils'
import { UserRO } from './interface'
import { UserEntity } from './entities'
import { CreateUserDto, UpdateUserDto } from './dto'
import { LoginUserDto } from 'src/app-system/app-auth/dto'
import { getEnv } from 'src/app-shared/config'

@Injectable()
export class AppUserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>
  ) {}

  // 统计用户个数
  async onFindUserAllCount(): Promise<number> {
    return await this.userRepo.count()
  }

  // 查找单个用户
  async onFindUserOne(options: FindOneOptions<UserEntity>): Promise<UserEntity | null> {
    return await this.userRepo.findOne(options)
  }

  // 创建用户
  async onCreateUser({ username, password, nickname, email }: CreateUserDto): Promise<UserEntity> {
    // create new user
    const hashPassword = await argon2.hash(password)
    const newUser = new UserEntity()
    newUser.id = genSnowFlakeId()
    newUser.username = username
    newUser.nickname = nickname
    newUser.password = hashPassword
    newUser.email = email
    newUser.createdBy = newUser.id
    newUser.createdTime = new Date()

    return await this.userRepo.save(newUser)

    // const errors = await validate(newUser)
    // if (errors.length > 0) {
    //   const _errors = { username: 'User input is not valid.' }
    //   throw new HttpException({ message: 'Input data validation failed', _errors }, HttpStatus.BAD_REQUEST)
    // } else {
    //   return await this.userRepo.save(newUser)
    // }
  }

  // 更新用户
  async onUpdateUser(id: string, updateUserDto: Partial<UserEntity>): Promise<UpdateResult> {
    // const toUpdate = await this.userRepo.findOne({
    //   where: { id },
    // })
    // delete toUpdate.password
    // const updatedUser = Object.assign(toUpdate, updateUserDto)
    return await this.userRepo.update(
      {
        id,
      },
      {
        ...updateUserDto,
        updatedTime: new Date(),
        updatedBy: id,
      }
    )
  }

  // 删除用户
  async onDeleteUser(username: string): Promise<DeleteResult> {
    return await this.userRepo.delete({ username: username })
  }

  // 通过用户 id 查找
  async onFindUserOneById(id: string, masking = true): Promise<UserEntity | null> {
    const findUser = await this.userRepo.findOne({
      where: {
        id,
      },
    })
    if (masking) {
      delete findUser.password
      delete findUser.status
    }
    return findUser
  }

  // 生成 token
  public onGenerateJWT({ id, username, updatedPwdTime }: UserEntity): string {
    return jwt.sign(
      {
        id,
        username,
        updatedPwdTime: new Date(updatedPwdTime).getTime(),
      },
      getEnv<string>('SERVER_JWT_SECRET'),
      {
        // 过期时间 seconds
        expiresIn: 1 * 24 * 60 * 60,
        // expiresIn: 5,
      }
    )
  }

  // 生成 refreshToken
  public onGenerateRefreshToken(user: UserEntity): string {
    return jwt.sign(
      {
        id: user.id,
        username: user.username,
        updatedPwdTime: new Date(user.updatedPwdTime).getTime(),
      },
      getEnv<string>('SERVER_JWT_SECRET'),
      {
        // 过期时间 seconds
        expiresIn: 30 * 24 * 60 * 60,
        // expiresIn: 20,
      }
    )
  }

  private buildUserRO(user: UserEntity) {
    const userRO = {
      id: user.id,
      username: user.username,
      nickname: user.nickname,
      token: this.onGenerateJWT(user),
    }
    return { user: userRO }
  }
}
