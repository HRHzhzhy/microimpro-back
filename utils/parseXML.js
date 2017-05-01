import xml2js from 'xml2js'
export const parseXMLAsync = (xml) => {
    return new Promise((resolve, reject) => {
        xml2js.parseString(xml, { trim: true }, (err, content) => {
            err ? reject(err) : resolve(content)
        })
    })
}
export const getMessage = function (stream, callback) {
  load(stream, (err, buf) => {
    if (err) {
      return (err)
    }
    var xml = buf.toString('utf-8')
    stream.msgXml = xml
    xml2js.parseString(xml, {trim: true}, callback)
  })
}
export const load = function (stream, callback) {
    // support content-type 'text/xml' using 'express-xml-bodyparser', which set raw xml string
    // to 'req.rawBody'(while latest body-parser no longer set req.rawBody), see
    // https://github.com/macedigital/express-xml-bodyparser/blob/master/lib/types/xml.js#L79
    if (stream.rawBody) {
        callback(null, stream.rawBody)
        return
    }

    var buffers = []
    stream.on('data', function (trunk) {
        buffers.push(trunk)
    });
    stream.on('end', function () {
        callback(null, Buffer.concat(buffers))
    });
    stream.once('error', callback)
}
export const formatMessage = (result) => {
    let message = {}
    if (typeof result === 'object') {
        let keys = Object.keys(result)
        for (let i = 0; i < keys.length; i++) {
            let item = result[keys[i]]
            if (!(item instanceof Array) || item.length === 0) {
                continue
            }
            let key = keys[i]
            if (item.length === 1) {
                let val = item[0]
                if (typeof val === 'object') {
                    message[key] = formatMessage(val)
                } else {
                    message[key] = (val || '').trim()
                }
            } else {
                message[key] = []
                for (let j = 0, k = item.length; j < k; j++) {
                    message[key].push(formatMessage(item[j]))
                }
            }
        }
    }
    return message
}

export default exports