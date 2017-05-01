import Express from 'express'
// import wxapi from 'wechat-api'
import bodyParser from 'body-parser'
import { readFileAsync } from './utils/file'
import { request } from './utils/http'
import { router as wechat } from './routers/wechat'
import { router as front } from './routers/front'
import { router as back } from './routers/back'
import { router as test } from './routers/index'
import mongoose from 'mongoose'
mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost:27017/robot').then(() => {
  console.log('connection succesful')
}).catch((err) => {
  console.error('connection err:', err)
})
const app = Express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: false
}))
/**
 * front: 为前端提供api接口，主要是拉取数据，用户信息操作
 * back: 为后端提供api接口，主要是提供课程管理，增删改查;定时任务，微信模板消息推送
 * wx: 微信公众号消息验证，转发
 */
app.use('/front', front)
app.use('/back', back)
app.use('/test', test)
app.use('/wx', wechat)
app.use('/*', (req, res) => {
  res.send('not found')
})

// app.get('/', (req, res) => {
//   // readFileAsync('./package.json', 'utf8').then((data) => {
//   //   console.log(data)
//   // }, (err) => {
//   //   console.log(err)
//   // })
//   // const baseUrl = 'https://api.weixin.qq.com/cgi-bin'
//   // let url = baseUrl  + '/token?grant_type=client_credential' + `&appid=wxcc507a33f8982b4d&secret=0fac14d66af49540b2054946234aa34f`
//   // request({url: url}).then((data) => {
//   //   data.expires_in = new Date().getTime() + (data.expires_in - 30) * 1000
//   //   console.log(data)
//   // }, (err) => {
//   //   console.log(err)
//   // })
//   res.send('hello express')
// })
app.listen(8888, () => {
  console.log('listening 8888')
})