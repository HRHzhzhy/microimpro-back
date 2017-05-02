import Express from 'express'
// import { readFileAsync, writeFileAsync } from '../utils/file'
// import { getApi } from '../utils/wechat'
import { initRobotMedia, initRobotMediaJson, cleanMedia, testDirName } from '../controllers/back/robot-action'
// import { list } from '../controllers/wechat/mediasList.json'
// const api = getApi()
export const router = Express.Router()
router.get('/initMedia', (req, res) => {
  initRobotMedia()
  res.send('initMedia done')
})
router.get('/initMediaJson', (req, res) => {
  initRobotMediaJson()
  res.send('initMediaJson done')  
})
router.get('/cleanMedia', (req, res) => {
  cleanMedia()
  res.send('cleanMedia done')  
})
router.get('/', (req, res) => {
  testDirName()
  // api.getMaterials('voice', 0, 20, (err, result) => {
  //   console.log(result, 'get file list')
  // })

  // 初始化media done
  // initRobotMedia()
  // initRobotMediaJson()
  
  





  // readFileAsync('/Users/zhenyong/free/microproject/wx-express/routers/hsk.txt', 'utf8').then((data) => {
  //   console.log(data)
  //   let result = []
  //   for (let i = 0; i < data.length; i++) {
  //     let item = {}
  //     for(let key in data[i]) {
  //       console.log('key:', key, 'value:', data[i][key])
  //       item.pinyin = key
  //       item.hanzi = data[i][key]
  //       item.name = `hsk-1-${i + 1}`
  //     }
  //     result.push(item)
  //     writeFileAsync('/Users/zhenyong/free/microproject/wx-express/routers/mediasList.txt' , result)
      
  //   }
  //   console.log(result)
  // }, (err) => {
  //   console.log(err)
  // })
  // let medias =
  // [ { media_id: 'u3_rMbZE6azZgWbBpTLdF3A13Fih9OCzvJLTcYqO8zA',
  //         name: 'HSK1级-007.mp3',
  //         update_time: 1492700972 },
  //       { media_id: 'u3_rMbZE6azZgWbBpTLdFxp2u0ESpOz0Af4sP0P_HoE',
  //         name: 'HSK1级-004.mp3',
  //         update_time: 1492700972 },
  //       { media_id: 'u3_rMbZE6azZgWbBpTLdF1vSM4KJ3MZGNYzv5uJVvmg',
  //         name: 'HSK1级-006.mp3',
  //         update_time: 1492700972 },
  //       { media_id: 'u3_rMbZE6azZgWbBpTLdF0HllgW_n7ZCZ_ThMJF614s',
  //         name: 'HSK1级-001.mp3',
  //         update_time: 1492700972 },
  //       { media_id: 'u3_rMbZE6azZgWbBpTLdF8uqZLHyB7pu-6GzCezt16g',
  //         name: 'HSK1级-008.mp3',
  //         update_time: 1492700971 },
  //       { media_id: 'u3_rMbZE6azZgWbBpTLdF656u7tqGZ1WgZ8h7XjccGE',
  //         name: 'HSK1级-002.mp3',
  //         update_time: 1492700971 },
  //       { media_id: 'u3_rMbZE6azZgWbBpTLdF22F8HWmz82dMtDZYF2XI3M',
  //         name: 'HSK1级-003.mp3',
  //         update_time: 1492700971 },
  //       { media_id: 'u3_rMbZE6azZgWbBpTLdF7qVK15sJcK8AscBRYtQhxM',
  //         name: 'HSK1级-009.mp3',
  //         update_time: 1492700971 },
  //       { media_id: 'u3_rMbZE6azZgWbBpTLdF6dWnt56aM1N_mvnOT3Sep8',
  //         name: 'HSK1级-005.mp3',
  //         update_time: 1492700971 }
  //   ]
  //   medias.sort((cur, next) => {
  //     cur = cur.name.split('-')
  //     next = next.name.split('-')
  //     let c = cur[cur.length - 1]
  //     let n = next[next.length - 1]
      
  //     c = c.split('.')
  //     n = n.split('.')

  //     c = c[0]
  //     n = n[0]
  //     return c - n
  //   })
  // writeFileAsync('/Users/zhenyong/free/microproject/wx-express/routers/medias.txt' , medias)
  res.send('test')
})
export default exports