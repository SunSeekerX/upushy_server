import { ApiResponseOptions } from '@nestjs/swagger'

export const RESPONSE_CODE_200: ApiResponseOptions = {
  status: 200,
  description: '操作成功',
}

export const RESPONSE_CODE_201: ApiResponseOptions = {
  status: 201,
  description: '创建成功',
}

export const RESPONSE_CODE_401: ApiResponseOptions = {
  status: 401,
  description: 'Token 不存在或者 Token 已过期',
}

export const RESPONSE_CODE_403: ApiResponseOptions = {
  status: 403,
  description: 'Api 签名验证失败',
}

export const RESPONSE_CODE_500: ApiResponseOptions = {
  status: 500,
  description: '后端应用程序错误',
}
