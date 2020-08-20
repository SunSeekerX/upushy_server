/**
 * @name:
 * @author: SunSeekerX
 * @Date: 2020-06-25 23:08:07
 * @LastEditors: SunSeekerX
 * @LastEditTime: 2020-08-17 10:42:05
 */

import {
  Injectable,
  HttpException,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, getRepository, DeleteResult } from 'typeorm'
import { validate } from 'class-validator'
const jwt = require('jsonwebtoken')

import { UserRO } from './user.interface'
import { UserEntity } from './user.entity'
import { LoginUserDto, CreateUserDto, UpdateUserDto } from './dto/index'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  // 查找全部
  async findAll(): Promise<UserEntity[]> {
    return await this.userRepository.find()
  }

  // 查找单个用户
  async findOne({ username }: LoginUserDto): Promise<UserEntity> {
    return (await this.userRepository.findOne({ username })) || null
  }

  // 创建用户
  async create({
    username,
    password,
    nickname,
    email,
  }: CreateUserDto): Promise<UserRO> {
    const qb = await getRepository(UserEntity)
      .createQueryBuilder('user')
      .where('user.username = :username', { username })
      .orWhere('user.email = :email', { email })

    const user = await qb.getOne()

    if (user) {
      const errors = { username: 'Username must be unique.' }

      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: `用户名：${username}，或邮箱：${email}已存在`,
        errors,
      })
    }

    // create new user
    const newUser = new UserEntity()
    newUser.username = username
    newUser.nickname = nickname
    newUser.password = password
    newUser.email = email

    const errors = await validate(newUser)
    if (errors.length > 0) {
      const _errors = { username: 'Userinput is not valid.' }
      throw new HttpException(
        { message: 'Input data validation failed', _errors },
        HttpStatus.BAD_REQUEST,
      )
    } else {
      const savedUser = await this.userRepository.save(newUser)
      return this.buildUserRO(savedUser)
    }
  }

  // 更新用户
  async update(id: number, dto: UpdateUserDto): Promise<UserEntity> {
    const toUpdate = await this.userRepository.findOne(id)
    delete toUpdate.password

    const updated = Object.assign(toUpdate, dto)
    return await this.userRepository.save(updated)
  }

  // 删除用户
  async delete(username: string): Promise<DeleteResult> {
    return await this.userRepository.delete({ username: username })
  }

  async findById(id: number): Promise<UserRO> {
    const user = await this.userRepository.findOne(id)

    if (!user) {
      const errors = { User: ' not found' }
      throw new HttpException({ errors }, 401)
    }
    return this.buildUserRO(user)
  }

  public generateJWT(user) {
    const today = new Date()
    const exp = new Date(today)
    exp.setDate(today.getDate() + 60)

    return jwt.sign(
      {
        id: user.id,
        username: user.username,
        exp: Math.floor(Date.now() / 1000) + 1 * 24 * 60 * 60,
        // exp: Math.floor(Date.now() / 1000) + 10,
      },
      process.env.TOKEN_SECRET,
    )
  }

  private buildUserRO(user: UserEntity) {
    const userRO = {
      id: user.id,
      username: user.username,
      nickname: user.nickname,
      token: this.generateJWT(user),
    }

    return { user: userRO }
  }
}
