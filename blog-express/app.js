var createError = require('http-errors');
var express = require('express');
var path = require('path');
var fs = require('fs')
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');
const RedisStore = require('connect-redis')(session)  // GET


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var blogRouter = require('./routes/blog');
var userRouter = require('./routes/user');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// GET 日志
const ENV = process.env.NODE_ENV
if( ENV !== 'production' ){
  // 开发 / 测试环境
  app.use(logger('dev'));
}else{ 
  // 线上环境
  const logFileName = path.join(__dirname, 'logs', 'access.log')
  const wrightStream = fs.createWriteStream( logFileName,  {
    flags: 'a'
  })
  app.use(logger('combined', {
    stream: wrightStream
  }));
}
// app.use(logger('dev', { 
//   stream: process.stdout  // 默认参数, 可以不写, 打印到控制台
// })); // 开发环境下日志 
app.use(express.json());  // 通过 req.body 获取post JSON格式数据
app.use(express.urlencoded({ extended: false })); // POST数据兼容其他格式
app.use(cookieParser());  // req.cookies
app.use(express.static(path.join(__dirname, 'public')));


// GET 将redis和session关联起来
const redisClient = require('./db/redis')
const sessionStore = new RedisStore({
  client: redisClient
})
app.use(session({
  secret: 'sd123ASRFW_', 
  cookie: {
    // path: '/',      // 默认配置
    // httpOnly: true, // 默认配置
    maxAge: 24 * 60 * 60 * 1000
  },
  store: sessionStore
}))

// router
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/blog', blogRouter);
app.use('/api/user', userRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
