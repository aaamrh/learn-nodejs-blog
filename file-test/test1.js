const fs = require('fs')
const path = require('path')


// __dirname 当前js目录
const fname = path.resolve(__dirname, 'data.txt')

// 读文件
// fs.readFile(fname, (err, data)=>{
//   if(err){
//     console.log(err)
//     return
//   }
//   // data是二进制内容，需要转化为字符串
//   console.log('file data is: ', data, data.toString())
// })


// 写入文件
// const content = '这是写入的内容\n'
// const opt = {
//   flag: 'a' // 追加写入, 覆盖写入: 'w'
// }
// // NOTE 每一次写入文件也很耗费内存, 因为每次写入需要打开文件等
// fs.writeFile(fname, content, opt, (err)=>{
//   if(err){ console.log(err) }
// })


// 判断文件是否存在
fs.exists(fname, (exist)=>{
  console.log('exist', exist)
})