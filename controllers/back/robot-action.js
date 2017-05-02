import mongoose from 'mongoose'
import path from 'path'
import { getApi } from '../../utils/wechat'
import { readFileAsync, writeFileAsync }  from '../../utils/file'
import { hskList } from './hsk-list.json'
const api = getApi()
import { RobotMedia, RobotUser, RobotMediaBase} from '../../models/robot'
// mongoose.Promise = global.Promise
// mongoose.connect('mongodb://localhost:27017/robot').then(() => {
//   console.log('connection succesful')
// }).catch((err) => {
//   console.error('connection err:', err)
// })
export const testDirName = () => {
  console.log(hskList)
}
export const initRobotMedia = (filePath) => {
  // 读列表，上传文件，获取mediaid，存到数据库
  // readFileAsync(__dirname + '/mediasList.txt', 'utf8').then((data) => {
    // console.log(data)
    let data = hskList
    for (let i = 0; i < data.length; i++) {
      let item = {}
      item.pinyin = data[i].pinyin
      item.hanzi = data[i].hanzi
      item.name = data[i].name
      api.uploadMaterial(__dirname + `/hsk/${item.name}.MP3`, 'voice', (err, result) => {
        if (err) {
          console.log(`upload ${item.name} failed:`, err)
        } else {
          item.mediaId = result.media_id
          let robotMedia = new RobotMedia({
            pinyin: item.pinyin,
            hanzi: item.hanzi,
            name: item.name,
            mediaId: item.mediaId
          })
          robotMedia.save((err, result) => {
            if (err) {
              console.log(`${item.name} upload error:${err}`)
            }
          })
        }
      })
    }
  // }, (err) => {
  //   console.log('')
  // })
}
export const initRobotMediaJson = () => {
  RobotMedia.find({}).exec((err, medias) => {
    console.log(medias)
    let list = {}
    medias.forEach((value, index, array) => {
      list[value.name] = {}
      list[value.name].name = value.name
      list[value.name].hanzi = value.hanzi
      list[value.name].pinyin = value.pinyin
      list[value.name].mediaId = value.mediaId
    })
    writeFileAsync('/Users/zhenyong/free/microproject/wx-express/controllers/wechat/mediasList.json', {list})
  })
}
/**
 * 目前只支持传单个文件，后续改成传目录
 * 将永久素材上传到微信后保存mediaid
 * @param {String} type 图片（image）、视频（video）、语音 （voice）、图文（news）
 * @param {String} filePath 文件路径
 * @param {String} callback 初始化成功之后的操作
 * 上传成功之后返回结果：{ media_id: 'u3_rMbZE6azZgWbBpTLdF9w9oyog88dfCBwExV0rxhE' } 'upload file'
 */
// export const initRobotMediaBase = (type, filePath, callback) => {
//   // { root: '/',   //根目录  
//   //   dir: '/home/user/dir', //文件所在目录  
//   //   base: 'file.txt',  //文件名  
//   //   ext: '.txt', //文件扩展名  
//   //   name: 'file' //文件名称，不含扩展名  
//   // } 
//   let pathObj = path.parse(filePath)
//   api.uploadMaterial('filepath', type, (err, result) => {
//     if (err) {
//       console.log(`${filePath} upload failed`)
//       return
//     }
//     let robotMedia = new RobotMedia({
//       name: pathObj.base,
//       mediaId: result.media_id
//     })
//     robotMediaBase.save()
//     callback(result)
//   })
// }

/**
 * 清空所有永久素材
 * getMaterialCount: { voice_count: 0, video_count: 0, image_count: 0, news_count: 0 }
 * getMaterials: 
  * {item: [ { media_id: 'u3_rMbZE6azZgWbBpTLdF7s0rilkIY9xzwI9cGbP9VQ', name: '诺基亚铃声.mp3',update_time: 1492533308 },
            { media_id: 'u3_rMbZE6azZgWbBpTLdF7s0rilkIY9xzwI9cGbP9VQ', name: '诺基亚铃声.mp3',update_time: 1492533308 }
          ],
    total_count: 17,
    item_count: 17 }
 */
export const cleanMedia = () => {
  // 删除素材
  api.getMaterialCount((err, result) => {
    console.log(result, 'get file count')
    const wxPerPage = 20
    let page = Math.ceil(result.voice_count / wxPerPage) // 向上取整
    for (let i = 0; i < page; i++) {
      let cur = i * wxPerPage
      let next = (i + 1) * wxPerPage
      if (i === page - 1) {
        next = result.voice_count
      }
      api.getMaterials('voice', cur, next, (err, result) => {
        console.log(result, 'get file list')
        for (let i = 0; i < result.item.length; i++) {
          api.removeMaterial(result.item[i].media_id, (err) => {
            err ? console.log(`remove ${result.item[i].name} failed: ${err}`) : ''
          })
        }
      })
    }
  })
}
/**
 * 删除某一类素材
 * @param {String} type 图片（image）、视频（video）、语音 （voice）、图文（news）
 */
// export const cleanMedia = (type) => {
//   // 删除素材
//   api.removeMaterial('media_id', callback)
// }



const robotUser = {}
const robotMedia = {}
// 获取列表 
robotUser.getList = () => {
  RobotUser.find({}).exec((err, users) => {
    console.log(users)
  })
}
robotUser.update = () => {
  RobotUser.findByIdAndUpdate(req.params.id, { $set: {nickname: ''}}, { new: true }, (err, RobotUser) => {
    console.log(RobotUser)
  })
}
robotMedia.getList = () => {
  RobotMedia.find({}).exec((err, medias) => {
    console.log(medias)
  })
}
export default exports