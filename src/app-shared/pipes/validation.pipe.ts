/**
 * @name:
 * @author: SunSeekerX
 * @Date: 2020-06-25 22:44:57
 * @LastEditors: SunSeekerX
 * @LastEditTime: 2020-08-11 10:34:05
 */
/**
 * @desc 暂时有bug，会将不存在于dto对象上的键值使用，实际应该是不需要使用，官方的没有这个问题，暂时未找到官方的ts实现
 * 等待后期查看
 */

import {
  PipeTransform,
  ArgumentMetadata,
  BadRequestException,
  HttpStatus,
  Injectable,
  ValidationPipeOptions,
} from '@nestjs/common'
import { validate, ValidatorOptions } from 'class-validator'
import { plainToClass } from 'class-transformer'
import { HttpException } from '@nestjs/common/exceptions/http.exception'

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  protected validatorOptions: ValidatorOptions
  constructor(options?: ValidationPipeOptions) {
    this.validatorOptions = options
  }

  async transform(value, metadata: ArgumentMetadata) {
    if (!value) {
      throw new BadRequestException('No data submitted')
    }

    const { metatype } = metadata
    if (!metatype || !this.toValidate(metatype)) {
      return value
    }

    const object = plainToClass(metatype, value, {
      // 排除不存在dto对象上的值
      // excludeExtraneousValues: true,
      // enableImplicitConversion: true,
    })

    const errors = await validate(object, this.validatorOptions)
    if (errors.length > 0) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Input data validation failed',
          errors: this.buildError(errors),
        },
        HttpStatus.BAD_REQUEST,
      )
    }
    return value
  }

  private buildError(errors) {
    const result = {}
    errors.forEach(el => {
      const prop = el.property
      Object.entries(el.constraints).forEach(constraint => {
        result[prop + constraint[0]] = `${constraint[1]}`
      })
    })
    return result
  }

  private toValidate(metatype): boolean {
    const types = [String, Boolean, Number, Array, Object]
    return !types.find(type => metatype === type)
  }
}
