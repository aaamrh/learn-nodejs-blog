const router = require('koa-router')()
const { login } = require('../controller/user')
const { SuccessModel, ErrorModel } = require('../model/resModel')


router.prefix('/api/user')

router.post('/login', async function (ctx, next) {
  const { username, password } = ctx.request.body;
  
  const result = await login(username, password)
  
  console.log('ctx.request', result)
  if(result.username){
    ctx.session.username = result.username
    ctx.session.realname = result.realname
    ctx.body = new SuccessModel()
    return
  }
  ctx.body = new ErrorModel('登录失败')
})

// router.get('/test', async (ctx, next)=>{
//   console.log(ctx.session)
//   if( ctx.session.viewCount === undefined ){
//     ctx.session.viewCount = 1
//   }

//   ctx.body = {
//     code: 0,
//     viewCount: ctx.session.viewCount
//   }
// })

module.exports = router
