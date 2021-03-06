import WechatAPI from 'wechat-api'
import { wechat } from './config'
import fs from 'fs'

export const getApi = () => {
  return new WechatAPI(wechat.appId, wechat.appSecret, (cb) => {
    fs.readFile(__dirname + '/wechat.txt', 'utf8', (err, txt) => {
      cb(null, JSON.parse(txt))
    }) 
  }, (token, cb) => {
    fs.writeFile(__dirname + '/wechat.txt', JSON.stringify(token), cb)
    console.log('savetokendata:', JSON.stringify(token))
  })
}
export default exports