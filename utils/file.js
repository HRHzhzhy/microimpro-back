import  fs from 'fs'
exports.readFileAsync = (fpath, encoding) => {
    return new Promise((resolve, reject) => {
     fs.readFile(fpath, encoding, (err, content) => {
    err ? reject(err) : resolve(JSON.parse(content))
        })
    })
}
exports.writeFileAsync = (fpath, content) => {
    content = JSON.stringify(content)
    return new Promise((resolve, reject) => {
        fs.writeFile(fpath, content, (err) => {
            err ? reject(err) : resolve()
        })
    })
}
export default exports