// 标准输入输出
// process.stdin.pipe(process.stdout)

// const http = require('http')
// const server = http.createServer((req, res)=>{
//   if(req.method === 'POST'){
//     req.pipe(res)
//   }
// })

// server.listen(8002)


// // stream 复制文件
// const fs = require('fs')
// const path = require('path')

// const fname1 = path.resolve(__dirname, 'data.txt')
// const fname2 = path.resolve(__dirname, 'data-bak.txt')

// const readStream = fs.createReadStream( fname1 )
// const writeStream = fs.createWriteStream( fname2 )

// readStream.pipe( writeStream )

// readStream.on('data', (chunk)=>{
//   console.log( 1)
// })

// readStream.on('end', () => {
//   console.log(' copy done ')
// })


// 流式读文件
const http = require('http')
const fs = require('fs')
const path = require('path')

const fname1 = path.resolve(__dirname, 'data.txt')

const server = http.createServer((req, res)=>{
  if(req.method === 'GET'){
    const readStream = fs.createReadStream( fname1 )
    readStream.pipe(res)
  }
})

server.listen(8002)

