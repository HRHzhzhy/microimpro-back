import { readFileAsync, writeFileAsync } from '../../utils/file'
import path from 'path'
const wechatFile = path.join(__dirname, './wechat.txt')

export const wechat = {
  appId: 'wxcc507a33f8982b4d',
  appSecret: '0fac14d66af49540b2054946234aa34f',
  token: 'hrh0402mircroimproforfreedomdemo',
  getAccessToken: () => {
    return readFileAsync(wechatFile)
  },
  saveAccessToken: (content) => {
    content = JSON.stringify(content)
    return writeFileAsync(wechatFile, content)
  }
}
const baseUrl = 'https://api.weixin.qq.com/cgi-bin/'
export const wechatUrl = {
  accessToken: baseUrl + 'token?grant_type=client_credential',
  upload: baseUrl + 'media/upload?',
  uploadPermanent: baseUrl + 'material/'
}
export default exports