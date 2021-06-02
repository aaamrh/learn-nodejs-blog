/**
 * 重要 ！！！ 
 * 模拟 中间件 
*/
// 组合中间件
function compose(middlewareList){
  return function(ctx){
    function dispatch(i){
      const fn = middlewareList[i]
      try{
        return Promise.resolve(
          // fn.bind() 是返回一个新的函数，并不执行。
          // fn() 是直接执行这个函数。
          // 是否执行，是两者最大的区别。
          fn(ctx, dispatch.bind(null, i+1))
        )
      }catch(err){
        return Promise.reject(err)
      }
    }
    return dispatch(0)
  }
}

const http = require('http')
class LikeKoa2 {
  constructor(){
    this.middlewareList = []
  }

  use(fn){
    this.middlewareList.push(fn)
    return this
  }

  createContext(req, res){
    const ctx = {
      req,
      res
    }
    ctx.query = req.query
    return ctx
  }

  handleRequest(ctx, fn){
    return fn(ctx)
  }

  callback(){
    const fn = compose(this.middlewareList)

    return (req, res) => {
      const ctx = this.createContext(req, res)

      return this.handleRequest(ctx, fn)
    }
  }

  listen(...args){
    const server = http.createServer(this.callback())

    server.listen(...args)
  }
}


// 运行代码
const app = new LikeKoa2()

app.use(async (ctx, next) => {
  await next();
  console.log(`1`);
});

// x-response-time
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  console.log('X-Response-Time', `${ms}ms`);
});

// response
app.use(async ctx => {
  console.log(3);
  ctx.res.end(JSON.stringify({a: 'hello world'}) );
});

app.listen(8000);

module.exports = LikeKoa2