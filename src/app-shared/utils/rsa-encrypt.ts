/**
 * RSA 加解密
 * @author: SunSeekerX
 * @Date: 2021-09-14 13:07:21
 * @LastEditors: SunSeekerX
 * @LastEditTime: 2021-09-14 16:54:00
 */

import * as NodeRSA from 'node-rsa'

function genNodeRSAObj(privateKey: string, format?: NodeRSA.Format, options?: NodeRSA.Options): NodeRSA {
  return new NodeRSA(privateKey, format, options)
}

function rsaDecrypt(nodeRSAObj: NodeRSA, data): string {
  return nodeRSAObj.decrypt(data, 'utf8')
}

function rsaEncrypt(nodeRSAObj: NodeRSA, data): string {
  return nodeRSAObj.encrypt(data, 'utf8')
}
export { genNodeRSAObj, rsaEncrypt, rsaDecrypt }
