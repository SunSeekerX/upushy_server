/**
 * @name:
 * @author: SunSeekerX
 * @Date: 2020-08-19 10:11:41
 * @LastEditors: SunSeekerX
 * @LastEditTime: 2020-10-28 22:58:08
 */

import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator'

@ValidatorConstraint({ name: 'customPlatform', async: false })
export class CustomOrder implements ValidatorConstraintInterface {
  validate(text: string): boolean {
    return text === 'ASC' || text === 'DESC'
  }

  defaultMessage(args: ValidationArguments): string {
    return `The order must be ASC or DESC, instead of ${args.value}`
  }
}
