// GET 密码 MD5 加密

const crypto = require('crypto')

// 密钥
const SECRET_KEY = 'SDFsgsaG23sxf'

// md5 加密
function md5(content){
  let md5 = crypto.createHash('md5')
  return md5.update( content ).digest('hex')
}

// 加密函数
function genPassword(pwd){
  return md5( pwd + SECRET_KEY )
}
