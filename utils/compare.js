export const strCompare = (source, target) => {
  let result = {}
  let t = target.split('')
  let reg = new RegExp("[\\u4E00-\\u9FFF]")
  for (let i = 0; i < t.length; i++) {
    let item = t[i]
    // 只比较汉字
    if (!reg.test(item)) {
      continue
    }
    if (source.indexOf(item) === -1) {
      result.errcode = 1
      t[i] = `【${item}】`
    }
  }
  result.value = t.join('').replace(/】【/g,'')
  return result
}
export default exports