/**
 * 重要 ！！！ 
 *  模拟 中间件 
*/

const http = require('http')
const slice = Array.prototype.slice

class LikeExpress {
  constructor(){
    // 存放中间件的列表
    this.routes = {
      all: [],
      get: [],
      post: []
    }
  }

  register(path){
    const info = {}
    if( typeof path === 'string' ){
      info.path = path
      info.stack = slice.call(arguments, 1)
    }else{
      info.path = '/'
      info.stack = slice.call(arguments, 0)
    }
    return info
  }

  use (){
    const info = this.register.apply(this, arguments) // GET 学习写法
    this.routes.all.push(info)
  }
  get(){
    const info = this.register.apply(this, arguments)
    this.routes.get.push(info)
  }
  post(){
    const info = this.register.apply(this, arguments)
    this.routes.post.push(info)
  }

  match(method, url){
    let stack = []
    if(url === '/favicon.ico'){
      return stack
    }

    let curRoutes = []
    curRoutes = curRoutes.concat(this.routes.all)
    curRoutes = curRoutes.concat(this.routes[method])

    curRoutes.forEach( routeInfo => {
      if(url.indexOf(routeInfo.path) === 0){
        stack = stack.concat(routeInfo.stack)
      }
    })

    return stack
  }

  // 核心next机制
  handle(req, res, stack){
    const next = () => {
      // 拿到第一个匹配的中间件
      const middleware = stack.shift()
      if(middleware){
        middleware(req, res, next)
      }
    }
    next()
  } 

  callback(){
    return (req, res)=>{
      res.json = (data) => {
        res.setHeader('content-type', 'application/json')
        res.end( JSON.stringify(data) )
      }
      const url = req.url
      console.log(url, req.method)
      const method = req.method.toLowerCase()
      const resultList = this.match(method, url)
      console.log('resultList', resultList)
      this.handle(req, res, resultList)
    }
  }

  listen(...args){
    const server = http.createServer( this.callback() )
    server.listen(...args)
  }
}

var a = new LikeExpress()
a.use((req, res, next)=>{
  console.log('中间件 1')
  console.log(1)

  next()
})
a.use((req, res, next)=>{
  console.log(2)

  next()
})

a.get('/hello', (req, res, next)=>{
  console.log('hello')

  res.json({ code: 0 })

})

a.listen(3000)



module.exports = () => {
  return new LikeExpress
}