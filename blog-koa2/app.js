const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')  // 只是将控制台中的log变得容易阅读
const session = require('koa-generic-session')
const redisStore = require('koa-redis')
const path = require('path')
const fs = require('fs')
const morgan = require('koa-morgan')


const index = require('./routes/index')
const users = require('./routes/users')
const blog = require('./routes/blog')
const user = require('./routes/user')

const  { REDIS_CONF, MYSQL_CONF } = require('./conf/db')

// error handler
onerror(app)

// middlewares
app.use(bodyparser({                    // 处理post数据, 可以接收很多种格式
  enableTypes:['json', 'form', 'text']
}))
app.use(json())                         // 处理post数据, 可以接收很多种格式
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))
app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

const ENV = process.env.NODE_ENV
if( ENV !== 'production' ){
  // 开发 / 测试环境
  app.use(morgan('dev'));
}else{ 
  // 线上环境
  const logFileName = path.join(__dirname, 'logs', 'access.log')
  const wrightStream = fs.createWriteStream( logFileName,  {
    flags: 'a'
  })
  app.use(morgan('combined', {
    stream: wrightStream
  }));
}


// GET 写在注册路由之前, 注册session后才能在ctx中获取到session: ctx.session
app.keys = ['3dDsgfv234']
app.use(session({
  // 配置cookie
  cookie: {
    path: '/',
    httpOnly: true,
    maxAge: 24*60*60*1000
  },
  // 配置 redis
  store: redisStore({
    all: `${REDIS_CONF.host}:${REDIS_CONF.port}` 
  })
}))



// routes
app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())
app.use(blog.routes(), blog.allowedMethods())
app.use(user.routes(), user.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
