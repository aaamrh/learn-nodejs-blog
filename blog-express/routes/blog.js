var express = require('express');

const { 
  getList, 
  getDetail, 
  newBlog,
  updateBlog,
  deleteBlog
} = require('../controller/blog');
const { SuccessModel, ErrorModel } = require('../model/resModel');
const loginCheck = require('../middleware/loginCheck')

var router = express.Router();

router.get('/list', function(req, res, next) {
  let author = req.query.author || '';
  const keyword = req.query.keyword || '';

  if( req.query.isadmin ){
    // 管理员界面      
    if(req.session.username == null){
      // 未登录
      res.json( new ErrorModel('未登录') )
      return
    }
    // 强制查询自己的博客
    author = req.session.username
  }

  // return new SuccessModel(listData)
  const result = getList(author, keyword);

  return result.then( listData => {
    // return new SuccessModel(listData) // before  
    res.json( new SuccessModel(listData) )
  } )
});


router.get('/detail', function(req, res, next) {
  const result = getDetail(req.query.id)

  return result.then( data => {
    res.json( new SuccessModel(data) )
  } )
});


router.post('/new', loginCheck, function(req, res, next) {
  req.body.author = req.session.username 
  const result = newBlog(req.body)
  return result.then(data => {
    res.json( new SuccessModel(data) ) 
  })
});


router.post('/update', loginCheck, function(req, res, next) {
  const result = updateBlog( req.query.id, req.body )

  return result.then( data => {
    if(data){ res.json( new SuccessModel('更新完成') ); return }

    res.json( new ErrorModel('更新失败') ) 
  } )
});


router.post('/del', loginCheck, function(req, res, next) {
  const result = deleteBlog(req.query.id, req.session.username) 
  return result.then(data => {
    if(data){
      res.json(new SuccessModel())
      return 
    }
    res.json( new ErrorModel('博客删除失败') )
  })
});


module.exports = router;