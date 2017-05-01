import WechatAPI from 'wechat-api'
import wechat from '../wechat/config'
import {readFileAsync } from '../../utils/file'
const api = new WechatAPI(wechat.appId, wechat.appSecret)
export const initMenu = () => {
  readFileAsync(`/Users/zhenyong/free/microproject/wx-express/controllers/wechat/menu.json`).then(menuData => {
    // console.log(menuData)
    api.createMenu(menuData, (err, result) => {
      console.log('init menu:', result)
    })
  })

}
export default exports