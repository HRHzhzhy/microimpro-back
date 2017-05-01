import { request } from '../../utils/http'
import { wechat, wechatUrl } from './config'

const isValidAccessToken = (tokenData) => {
  // 验证有无accessToken
  console.log('验证')
  if (!data || !data.access_token || !data.expires_in) {
    return false
  }
  // 验证是否过期
  let now = (new Date().getTime())
  if (now < data.expires_in) {
    return true
  } else {
    return false
  }
}
const updateAccessToken = () => {
    let appId = wechat.appId
    let appSecret = wechat.appSecret
    let url = wechatUrl.accessToken + `&appid=${appId}&secret=${appSecret}`
    console.log('2222')
    
    return new Promise((resolve, reject) => {
      request({ url: url, json: true }).then((response) => {
        let data = response.data
        let now = (new Date().getTime())
        let expires_in = now + (data.expires_in - 20) * 1000
        data.expires_in = expires_in //新的过期时间
        wechat.saveAccessToken(data)
    console.log('3333')
        
        resolve(data)
      })
    })
  }





export const getWechat = async () => {
  // let tokenData = await wechat.getAccessToken()
  // console.log(tokenData)
  // if (!isValidAccessToken(tokenData)) {
  // console.log(tokenData, '2222')
    
  //   tokenData = await updateAccessToken()
  // }
  let  tokenData = await updateAccessToken()
  
  let wx = new Wechat(tokenData)
  return wx
}


export class Wechat {
  constructor(tokenData) {
    this.appId = wechat.appId
    this.appSecret = wechat.appSecret
    this.access_token = tokenData.access_token
    // this.getAccessToken = wechat.getAccessToken
    // this.saveAccessToken = wechat.saveAccessToken
    // this.fetchAccessToken()
  }
  fetchAccessToken() {
    if (this.access_token && this.expires_in) {
      if (this.isValidAccessToken(this)) {
        return Promise.resolve(this)
      }
    }
    this.getAccessToken().then((data) => {
      try {
        data = JSON.parse(data)
      } catch (e) {
        return this.updateAccessToken()
      }

      if (this.isValidAccessToken(data)) {
        return Promise.resolve(data)
      } else {
        return this.updateAccessToken()
      }

    }).then((data) => {// 获取到token都是通过updateAccessToken获取，这里的then getAccessToken所有return得到的promise的then
      // 设置accessToken 过期时间，保存accessToken
      this.access_token = data.access_token
      this.expires_in = data.expires_in
      this.saveAccessToken(data)

      return Promise.resolve(data)
    })
  }

  isValidAccessToken(tokenData) {
    // 验证有无accessToken
    if (!data || !data.access_token || !data.expires_in) {
      return false
    }
    // 验证是否过期
    let now = (new Date().getTime())
    if (now < data.expires_in) {
      return true
    } else {
      return false
    }
  }
  updateAccessToken() {
    let appId = this.appId
    let appSecret = this.appSecret
    let url = wechatUrl.accessToken + `&appid=${appId}&secret=${appSecret}`
    return new Promise((resolve, reject) => {
      request({ url: url, json: true }).then((response) => {
        let data = response.data
        let now = (new Date().getTime())
        let expires_in = now + (data.expires_in - 20) * 1000
        data.expires_in = expires_in //新的过期时间
        resolve(data)
      })
    })
  }

  customInfo(content) {
    let url = `https://api.weixin.qq.com/cgi-bin/message/custom/send?access_token=${this.access_token}`
    request({
      url: url,
      method: 'POST',
      data: content
    }).then((data) => {
      console.log(data.data)
    })
  }
}

export default exports