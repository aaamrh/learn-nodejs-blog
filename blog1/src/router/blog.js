const { 
  getList, 
  getDetail, 
  newBlog,
  updateBlog,
  deleteBlog
} = require('../controller/blog')
const { SuccessModel, ErrorModel } = require('../model/resModel')


// 登录验证中间件
const loginCheck = (req) => {
  if( !req.session.username ){
    return Promise.resolve( new ErrorModel('尚未登录') )
  }
}


const handleBlogRouter = (req, res) => {
  const method = req.method;
  const id = req.query.id

  if(method === 'GET' && req.path === '/api/blog/list'){
    let author = req.query.author || '';
    const keyword = req.query.keyword || '';
    // const listData = getList(author, keyword)

    if( req.query.isadmin ){
      // 管理员界面      
      const loginCheckResult = loginCheck(req)
      if(loginCheckResult){
        // 未登录
        return loginCheckResult
      }
      // 强制查询自己的博客
      console.log('author', req.session.username)
      author = req.session.username
    }

    // return new SuccessModel(listData)
    const result = getList(author, keyword);

    return result.then( listData => {
      console.log(listData)
      return new SuccessModel(listData)  
    } )

  }

  if(method === 'GET' && req.path === '/api/blog/detail'){
    // const data = getDetail(id)
    // return new SuccessModel(data)

    const result = getDetail(id)

    return result.then( data => {
      return new SuccessModel(data)
    } )
  }

  if(method === 'POST' && req.path === '/api/blog/new'){
    // const data = newBlog(req.body)
    // return new SuccessModel(data)

    const loginCheckResult = loginCheck(req)
    if(loginCheckResult){
      return loginCheckResult
    } 

    req.body.author = req.session.username // FIXME 假数据， 等开发登录时换成真数据
    const result = newBlog(req.body)
    return result.then(data => {
      return new SuccessModel(data)
    })
  }

  if(method === 'POST' && req.path === '/api/blog/update'){
    const result = updateBlog( id, req.body )

    const loginCheckResult = loginCheck(req)
    if(loginCheckResult){
      return loginCheckResult
    }

    return result.then(data => {
      if(data){ return new SuccessModel('更新完成') }
      return new ErrorModel('更新失败')
    })
  }

  if(method === 'POST' && req.path === '/api/blog/del'){
    const result = deleteBlog(id, req.session.username) 
    const loginCheckResult = loginCheck(req)
    if(loginCheckResult){
      return loginCheckResult
    }

    return result.then(data => {
      if(data){
        return new SuccessModel()
      }
      return new ErrorModel('博客删除失败')
    })
  }
}

module.exports = handleBlogRouter