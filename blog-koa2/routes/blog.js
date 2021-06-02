const router = require('koa-router')()
const { 
  getList, 
  getDetail, 
  newBlog,
  updateBlog,
  deleteBlog
} = require('../controller/blog');
const { SuccessModel, ErrorModel } = require('../model/resModel');
const loginCheck = require('../middleware/loginCheck');
const { get } = require('../../blog-express/routes/blog');

router.prefix('/api/blog')

router.get('/list', async function (ctx, next) {
  let author = ctx.query.author || '';
  const keyword = ctx.query.keyword || '';

  if( ctx.query.isadmin ){
    // 管理员界面      
    if(ctx.session.username == null){
      // 未登录
      ctx.body = new ErrorModel('未登录') 
      return
    }
    // 强制查询自己的博客
    author = ctx.session.username
  }

  const result = await getList(author, keyword);
  ctx.body = new SuccessModel(result)

  // express 写法
  // return result.then( listData => {
  //   res.json( new SuccessModel(listData) )
  // } )
})

router.get('/detail', async function(ctx, next){
  const result = await getDetail(ctx.query.id)
  ctx.body = new SuccessModel(result)
})

router.post('/new', loginCheck, async function(ctx, next){
  ctx.request.body.author = ctx.session.username 
  const result = await newBlog( ctx.request.body )
  ctx.body = new SuccessModel(result)
})

router.post('/update', async function(ctx, next){
  const result = await updateBlog( ctx.query.id, ctx.request.body )
  if(result){ ctx.body =  new SuccessModel('更新完成'); return }
  ctx.body = new ErrorModel('更新失败') 
})

router.post('/delete', async function(ctx, next){
  const result = await deleteBlog(ctx.query.id, ctx.session.username) 

  if(result){
    ctx.body = new SuccessModel()
    return 
  }
  ctx.body = new ErrorModel('博客删除失败') 
})

module.exports = router
