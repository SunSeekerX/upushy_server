/**
 * @name:
 * @author: SunSeekerX
 * @Date: 2021-07-09 17:16:27
 * @LastEditors: SunSeekerX
 * @LastEditTime: 2021-07-09 17:21:52
 */

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as express from 'express'
declare global {
  namespace Express {
    interface Request {
      user?: Record<string, any>
    }
  }
}
