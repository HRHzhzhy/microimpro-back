// import mongoose from 'mongoose'
import { wechat, wechatUrl } from './config'
import sha1 from 'sha1'

export const  checkSignature = (opts) => {
  let result = false
  if (opts && opts.timestamp && opts.nonce && opts.signature && opts.timestamp) {
    let str = [wechat.token, opts.timestamp, opts.nonce].sort().join('')
    if (sha1(str) === opts.signature) {
      result = true
    } 
  }
  return result
}
export default exports