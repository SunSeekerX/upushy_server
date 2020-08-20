/**
 * @name: 
 * @author: SunSeekerX
 * @Date: 2020-08-10 20:32:54
 * @LastEditors: SunSeekerX
 * @LastEditTime: 2020-08-19 10:11:47
 */

import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator'

@ValidatorConstraint({ name: 'customPlatform', async: false })
export class CustomPlatform implements ValidatorConstraintInterface {
  validate(text: string, args: ValidationArguments) {
    return text === 'ios' || text === 'android'
  }

  defaultMessage(args: ValidationArguments) {
    return `The platform must be android or ios, instead of ${args.value}`
  }
}
