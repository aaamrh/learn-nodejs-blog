const { login } = require('../controller/user')
const { SuccessModel, ErrorModel } = require('../model/resModel')
const { set } = require('../db/redis')


// GET 设置 cookie 过期时间
const getCookieExpires = () => {
  const d = new Date()
  d.setTime( d.getTime() + (24 * 60 * 60 * 1000) )

  return d.toGMTString()
}

const handleUserRouter = (req, res) => {
  const method = req.method;

  // 登录
  if(method === 'POST' && req.path === '/api/user/login'){
    const { username, password } = req.body;

    const result = login(username, password)

    return result.then( val => {
      if(val.username){
        // GET 设置cookie
        // req.setHeader('Set-Cookie', `username=${val.username}; path=/; httpOnly; expires=${getCookieExpires()}`)
        req.session.username = val.username
        req.session.realname = val.realname
        // 同步到redis中
        set(req.sessionId, req.session)

        return new SuccessModel()
      }
      return new ErrorModel('登录失败')
    })
  }

  // 登录验证的测试
  if(method === 'GET' && req.path === '/api/user/login-test') {
    if(req.session.username){
      // GET 使用方法
      return Promise.resolve(new SuccessModel({
        session: req.session
      })) 
    }
    return Promise.resolve( new ErrorModel('尚未登录'))
  } 

}
module.exports = handleUserRouter