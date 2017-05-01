import { getWechat } from './wechat'
import mongoose from 'mongoose'
import { RobotMedia, RobotUser } from '../../models/robot'
import { list } from '../wechat/mediasList.json'
import { strCompare } from '../../utils/compare'
import { getApi } from '../../utils/wechat'
const api = getApi()
const sentToUser = (robotUserId, textMsg, voiceMsg) => {
  api.sendText(robotUserId, textMsg, (err, result) => {
    console.log(result, 'send Text')
    voiceMsg ? api.sendVoice(robotUserId, voiceMsg, (err, result) => {
      console.log(result, 'send Voice')
    }) : ''
  })
}
/**
 * 当前级别是否有错误的
 * @param {String} cur 当前 hsk-1-1
 * @param {Array} list 错误句子['hsk-1-1', 'hsk-1-2']
 */
const isCurrentLevelInFailure = (cur, list) => {
  cur = cur.split('-')
  cur = [cur[0], cur[1]].join('-')
  for (let i = 0; i < list.length; i++) {
    if (list[i].name.indexOf(cur) >= 0) {
      return list[i].name.indexOf(cur)
    }
  }
  return false
}
/**
 * 判断当前句是否在历史记录里
 * @param {*} cur 
 * @param {*} list finished list || failed list
 */
const isCurrentInList = (cur, list) => {
  console.log(cur,'|', list)
  if (!list.length) {
    return false
  }
  for (let i = 0; i < list.length; i++) {
      console.log(list[i].name, '||', cur)
    
    if (list[i].name === cur) {
      return true
    }
  }
  return false
}
const totalLevel = 6
const everyLevelNum = 30
/**
 * 
 * @param {String} cur 当前句子 'hsk-1-1'
 * @param {Array} finished 所有已经完成的句子
 */
const getCurrentMedia = (cur, finished) => {
  let result = {}
  let errcode = 0
  result.str = cur.split('-')
  result.str[1] = parseInt(result.str[1])
  result.str[2] = parseInt(result.str[2])
  if (result.str.length !== 3) {
    result.errcode = 1
    result.str = result.str.join('-')
    return result
  }
  if (result.str[1] === totalLevel && result.str[2] === everyLevelNum) {
    result.errcode = 2
    result.str = result.str.join('-')
    return result
  }
  if ((result.str[1] === totalLevel || result.str[1] < totalLevel) && result.str[2] < everyLevelNum) {
    result.str[2] += 1
    result.str = result.str.join('-')
    if (finished.indexOf(result.str) > 0) {
      return getCurrentMedia(result.str, finished)
    }
    return result
  }
  if (result.str[2] === everyLevelNum) {
    result.str[2] = 1
    result.str[1] += 1
    result.str = result.str.join('-')
    if (finished.indexOf(result.str) > 0) {
      return getCurrentMedia(result.str, finished)
    } else {
      result.errcode = 3
    }
    return result
  }
}
const defaultMsg = `欢迎使用 \n 你可以跟读跟读语音 \n 纠正发音`
export const reply = (msg) => {
  // if (msg.MsgType !== 'voice') {
  //   sentToUser(msg.FromUserName, defaultMsg)
  //   return
  // }
  // 进入跟读
  // console.log(msg)
  
  msg.Recognition = msg.Content
  if (msg.Recognition.length < 2) {
    sentToUser(msg.FromUserName, '抱歉，我听不清')
    return
  }
  RobotUser.findOne({ openId: msg.FromUserName }).exec((err, robotUser) => {
    let textMsg = ``
    let voiceMsg = ``
    if (!robotUser) {
      let robotUser = new RobotUser({
        openId: msg.FromUserName,
      })
      robotUser.save((err, result) => {
        if (err) {
          console.log('save robotUser err:', err)
        }
        // console.log('save result:', result)
      })
      textMsg = `【问候语:】你好\n 【使用规则:】请跟读句子\n${list['hsk-1-1'].hanzi}`
      voiceMsg = list['hsk-1-1'].mediaId
      // 记录当前句子，当前level
      sentToUser(msg.FromUserName, textMsg, voiceMsg)
      return           
    }
    robotUser.failure.sort((current, next) => {
      return next.time - current.time
    })
    let compareResult = strCompare(list[robotUser.current].hanzi, msg.Recognition)
    let cur = getCurrentMedia(robotUser.current, robotUser.finished)
    if (cur.errcode === 1) {
      console.log('robotUser.current is not valid:', robotUser.current)
      return
    }
    // 读错了
    if (compareResult.errcode && compareResult.errcode === 1) {
      if (robotUser.wrongTimes > 1) {        
        if (isCurrentInList(robotUser.current, robotUser.failure)) {
          // 更新错误时间
          let currentName = robotUser.current
          RobotUser.update({ openId: msg.FromUserName, 'failure.name': currentName}, { 
            $set:{
                'failure.$.time': (new Date()).getTime()
              }
            }, (err, result) => {
              if (err) {
                console.log('err:', err)
              }
              // console.log('更新错误时间 result:', result)
          })
        } else {          
          robotUser.failure.push({name: robotUser.current, time: (new Date()).getTime()})
        }
        // 更新当前句子'
        robotUser.current = cur.str
        textMsg = `【读错了,下一句:】你好\n ${list[robotUser.current].hanzi}`
        voiceMsg = list[robotUser.current].mediaId
        RobotUser.update({ openId: msg.FromUserName }, { 
          $set:{
              current: robotUser.current,
              wrongTimes: 0
            }
          }, (err, result) => {
            if (err) {
              console.log('err:', err)
            }
        })
      } else {
        RobotUser.findOneAndUpdate({ openId: msg.FromUserName, 'failure.name': {$ne: robotUser.current} }, { 
            $addToSet:{ 
              failure: {
                name: robotUser.current,
                time: (new Date()).getTime()
              },
            }
          }, (err, result) => {
            if (err) {
              console.log('err:', err)
            }
        })
        RobotUser.findOneAndUpdate({ openId: msg.FromUserName }, { 
            $set:{
              wrongTimes: robotUser.wrongTimes + 1
            }
          }, (err, result) => {
            if (err) {
              console.log('err:', err)
            }
        })
        textMsg = `【再读一次:】你好\n ${list[robotUser.current].hanzi}`
        voiceMsg = list[robotUser.current].mediaId
      }
      sentToUser(msg.FromUserName, textMsg, voiceMsg)
      return
    }
    // 读对了
    RobotUser.findOneAndUpdate({ openId: msg.FromUserName }, { 
        $addToSet:{ 
          finished: robotUser.current
        },
        $set:{
          wrongTimes: 0
        }
      }, (err, result) => {
    })
    // robotUser.finished.push(robotUser.current)
    if (isCurrentInList(robotUser.current, robotUser.failure)) {
      // 移除robotUser.failure 
      RobotUser.findOneAndUpdate({ openId: msg.FromUserName }, { 
          $pull:{ 
            failure: {
              name: robotUser.current
            }
          }
        }, (err, result) => {
      })
      robotUser.failure.splice(0,1)
    }
    // 历史记录，历史记录的第一项，历史记录的第一项大于24小时;
    let now = (new Date()).getTime()
    if ((robotUser.failure && robotUser.failure[0] && (now - robotUser.failure[0].time) > 24 * 60 * 60 * 1000) || (cur.errcode === 2 && robotUser.failure.length)) {
      // 读取并发送历史记录
      robotUser.current = robotUser.failure[0]
      // 更新当前句子'
      textMsg = `【这是错误的句子:】${list[robotUser.current].hanzi}`
      voiceMsg = list[robotUser.current].mediaId
      sentToUser(msg.FromUserName, textMsg, voiceMsg)
      RobotUser.update({ openId: msg.FromUserName }, { 
        $set:{ 
            current: robotUser.current
          }
        })
      return
    }
    if (!isCurrentInList(robotUser.current, robotUser.failure) && cur.errcode === 3) {
      // 发对应hsk-x的图片
      // 更新当前句子'
      robotUser.current = cur.str      
      api.sendImage(robotUserId, imageId, (err, result) => {
        textMsg = list[robotUser.current].hanzi
        voiceMsg = list[robotUser.current].mediaId
        sentToUser(msg.FromUserName, textMsg, voiceMsg)
      })
      RobotUser.update({ openId: msg.FromUserName }, { 
        $set:{ 
          current: robotUser.current
        }
      })
    }
    robotUser.current = cur.str
    textMsg = `【这是正常的句子:】${list[robotUser.current].hanzi}`
    voiceMsg = list[robotUser.current].mediaId
    sentToUser(msg.FromUserName, textMsg, voiceMsg)
    RobotUser.update({ openId: msg.FromUserName }, { 
      $set:{ 
        current: robotUser.current
      }
    })
  })
}
export default exports