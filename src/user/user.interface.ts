/**
 * @name:
 * @author: SunSeekerX
 * @Date: 2020-06-25 23:28:11
 * @LastEditors: SunSeekerX
 * @LastEditTime: 2020-06-25 23:28:37
 */

export interface UserData {
  username: string
  nickname: string
  token: string
}

export interface UserRO {
  user: UserData
}
