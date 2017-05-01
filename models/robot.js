import mongoose from 'mongoose'
const ObjectId = mongoose.Schema.Types.ObjectId
// {
//  "subscribe": 1,
//  "openid": "o6_bmjrPTlm6_2sgVt7hMZOPfL2M",
//  "nickname": "Band",
//  "sex": 1,
//  "language": "zh_CN",
//  "city": "广州",
//  "province": "广东",
//  "country": "中国",
//  "headimgurl": "http://wx.qlogo.cn/mmopen/g3MonUZtNHkdmzicIlibx6iaFqAc56vxLSUfpb6n5WKSYVY0ChQKkiaJSgQ1dZuTOgvLLrhJbERQQ4eMsv84eavHiaiceqxibJxCfHe/0",
//  "subscribe_time": 1382694957
// }
const user = mongoose.Schema({
  openid: { type: String, index: true, required: true },
  subscribe: Number,
  nickname: String,
  sex: Number,
  language: { type: String, default: 'zh_CN' },
  city: String,
  province: String,
  country: String,
  headimgurl: String,
  subscribeTime: Number,
  createdAt: { type: Date, default: Date.now() },
  updateAt: { type: Date, default: Date.now() }
})
export const User = mongoose.model('User', user)

const robotMediaSchema = mongoose.Schema({
  name: String,
  mediaId: String,
  hanzi: String,
  pinyin: String,
  createdAt: { type: Date, default: Date.now() },
  updateAt: { type: Date, default: Date.now() }
})
export const RobotMedia = mongoose.model('RobotMedia', robotMediaSchema)

const robotUserSchema = mongoose.Schema({
  openId: { type: String, index: true, required: true },
  // finished: { type: String, default: '[]' },
  // failure: { type: String, default: '[]' },
  current: { type: String, default: 'hsk-1-1' },
  wrongTimes: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now() },
  updateAt: { type: Date, default: Date.now() },
  finished: [ String ],
  failure: [{ name: { type: String }, time: { type: Number, default: (new Date()).getTime() } }]
})
export const RobotUser = mongoose.model('RobotUser', robotUserSchema)

export default exports