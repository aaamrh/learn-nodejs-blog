const fs = require('fs')
const path = require('path')

function writeLog(writeStream, log){
  writeStream.write(log + '\n')  // GET 
}


function createWriteStream(fname){
  const fullFileName = path.join(__dirname, '../../', 'logs', fname)
  const writeStream = fs.createWriteStream(fullFileName, {
    flags: 'a'
  })

  return writeStream
}


// 写访问日志
const accessWriteStream = createWriteStream('access.log')
function access(log){
  writeLog(accessWriteStream, log)
}

module.exports = {
  access
}