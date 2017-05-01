export const textToNum = (str) => {
  let arr = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十']
  for (let i = 0; i < arr.length; i++) {
    str = str.replace(new RegExp(arr[i], 'g'), i)
  }
  return str
}
// export const 