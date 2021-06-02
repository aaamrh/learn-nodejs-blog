var express = require('express');
var router = express.Router();
const { login } = require('../controller/user')
const { SuccessModel, ErrorModel } = require('../model/resModel')

router.post('/login', function(req, res, next) {
  const { username, password } = req.body;

  const result = login(username, password)

  return result.then( val => {
    if(val.username){
      // GET 设置session 
      req.session.username = val.username
      req.session.realname = val.realname
      // NOTE 同步到redis中， 执行上面语句后会直接同步到redis中
      // set(req.sessionId, req.session)

      res.json(new SuccessModel()) 
      return
    }
    res.json(new ErrorModel('登录失败'))
  })
});


router.get('/login-test', function(req, res, next) {
  if(req.session.username){
    res.json({
      code: 0,
      msg: '登录成功'
    })
    return
  }
  res.json({
    code: -1,
    msg: '未登录'
  })
});


module.exports = router;
