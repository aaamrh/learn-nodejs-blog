const fs = require('fs')
const path = require('path')


// callback 的方式获取一个文件的内容
function getfileContent(filename, callback){
  // __dirname 当前文件的目录
  const fullFileName = path.resolve(__dirname, 'files', filename)

  fs.readFile(fullFileName, (err, data)=>{
    if(err){
      console.log(err)
      return 
    }

    callback( JSON.parse (data.toString()) )
  })
}

// getfileContent('a.json', data =>{
//   console.log('a data', data)
//   getfileContent(data.next, bData => {
//     console.log('b data', bData)
//     getfileContent(bData.next, cData => {
//       console.log('c data',cData)
//     })
//   })
// })


function myPromise(filename){
  return new Promise( (resolve, reject)=>{
    const fullFileName = path.resolve(__dirname, 'files', filename)
    fs.readFile(fullFileName, (err, data)=>{
      if(err){
        reject(err)
        return 
      }
      console.log('resolve', resolve)
      resolve( JSON.parse (data.toString()) )
    })
  })
}
myPromise('a.json')
.then( aData =>{console.log('promise a data', aData); return myPromise(aData.next) } )
// .then( bData =>{console.log('promise b data', bData); return myPromise(bData.next) } )
// .then( cData =>{console.log('promise c data', cData); return 'null1' } )
// .then( res=>{ console.log('res', res) } )
// .then( res=>{ console.log(res) } )

// async / await
async function readFileData(){
  // 同步写法
  try {
    const aData = await myPromise('a.json')
    console.log("async a data", aData)
    
    const bData = await myPromise(aData.next)
    console.log("async b data", bData) 
  
    const cData = await myPromise(bData.next)
    console.log("async c data", cData)
  }catch(err){
    console.log(err)
  }
}

// readAData()  返回的是个promise
async function readAData(){
  const aData = await myPromise('a.json')
  return aData
}
async  function test(){
  const aData = await readAData()
  console.log(aData)
}
test()
// async / await 要点: 
// 1. await 后面可以追加promise对象, 获取resolve的值
// 2. await 必须包裹在 async 函数中
// 3. async 函数执行返回的也是一个 promise 对象
// 4. try-catch 结果 promise 中reject的值