import Express from 'express'
import { getMessage, formatMessage } from '../utils/parseXML'
import { reply } from '../controllers/wechat/robot-reply'
// import sha1 from 'sha1'
import { checkSignature } from '../controllers/wechat/check-signature'
export const router = Express.Router()
/**
 * 校验签名
 */
router.get('/', (req, res) => {
  let opts = {}
	opts.signature = req.query.signature
	opts.timestamp = req.query.timestamp
	opts.nonce = req.query.nonce
	let echostr = req.query.echostr
  let answerMsg = checkSignature(opts) ? echostr : 'access failed'
  res.send(answerMsg)
})
/**
 * 处理消息和事件推送
 * 1. 记录用户名，如果没有就创建，保存到数据库
 * 2. 转接到客服消息，推送多条消息（不要超过三条）
 */
router.post('/', (req, res) => {
  // todo 解析微信消息，根据微信消息处理业务逻辑
  getMessage(req, function (err, result) {
    let msg = formatMessage(result.xml)
    switch (msg.MsgType) {
      case 'event':
        break;
      default:
        break;
    }
    console.log('router wechat post')
    reply(msg)
  })
  res.status(200).send('')
})
export default exports