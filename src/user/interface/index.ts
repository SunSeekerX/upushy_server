/**
 * 统一导出
 * @author: SunSeekerX
 * @Date: 2021-09-14 17:50:15
 * @LastEditors: SunSeekerX
 * @LastEditTime: 2021-09-14 17:50:15
 */

export interface UserData {
  username: string
  nickname: string
  token: string
}

export interface UserRO {
  user: UserData
}
