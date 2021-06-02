const querystring = require('querystring')
const { get, set } = require('./src/db/redis')
const { access } = require('./src/utils/log')
const handleBlogRouter = require('./src/router/blog')
const handleUserRouter = require('./src/router/user')

// session数据
// const SESSION_DATA = {}
const getCookieExpires = () => {
  const d = new Date()
  d.setTime( d.getTime() + (24 * 60 * 60 * 1000) )

  return d.toGMTString()
}   


// 用于处理 post data
const getPostData = (req) => {
  return new Promise( (resolve, reject) => {
    if( req.method !== 'POST' ){
      resolve({})
      return 
    }   

    if( req.headers['content-type'] !== 'application/json' ){
      resolve({})
      return 
    }

    let postData = ''
    req.on('data', (chunk)=>{
      postData += chunk.toString()
    })

    req.on('end', ()=>{
      if(!postData){
        resolve({})
        return 
      }
      resolve( JSON.parse(postData) )
    })

  })
}

const serverhandle = ( req, res ) => {
  // 记录 access log
  access(`${req.method} -- ${req.url} -- ${req.headers['user-agent']} -- ${Date.now()}`)

  // req: path query body cookie session 

  // 设置返回json格式
  res.setHeader('Content-Type', 'application/json');

  // 获取 path
  const url = req.url;
  req.path = url.split('?')[0];

  // 解析query
  req.query = querystring.parse( url.split('?')[1] )

  // 解析 cookie
  req.cookie = {}
  const cookieStr = req.headers.cookie || '';
  cookieStr.split(';').forEach(item => {
    if(!item){ return }

    const arr = item.split('=');
    const key = arr[0].trim()
    const val = arr[1]
    req.cookie[key] = val
  })
  // console.log('req.cookie is ', req.cookie) 

  // 解析session
  // let needSetCookie = false; // 新用户  则需要设置cookie
  // let userId = req.cookie.userid
  // if(userId){
  //   if(!SESSION_DATA[userId]){ SESSION_DATA[userId] = {} }
  // }else{
  //   needSetCookie = true
  //   userId = `${ Date.now() }_${ Math.random() }`
  //   SESSION_DATA[userId] = {}
  // }
  // req.session = SESSION_DATA[userId]
  // console.log(req.query)

  // GET redis 替换 session
  let needSetCookie = false; 
  let userId = req.cookie.userid;
  if( !userId ){ 
    needSetCookie = true;
    userId = `${ Date.now() }_${ Math.random() }`
    set(userId, {}) //初始化 session
  }
  // 获取session
  req.sessionId = userId
  get(req.sessionId).then(sessionData=>{
    console.log('sessionData', sessionData)
    if(sessionData == null ){
      set(req.sessionId, {})
      req.session = {}
    }else{
      req.session = sessionData; 
    }

      
    return getPostData(req)
  })
  .then( (postData)=>{
    req.body = postData;

    // 处理blog路由
    // const blogData = handleBlogRouter(req, res)
    // if(blogData){
    //   res.end( JSON.stringify(blogData) )
    //   return
    // }
      
    const blogResult = handleBlogRouter(req, res)
    if(blogResult){
      blogResult.then( blogData => {
        if(needSetCookie){
          res.setHeader('Set-Cookie', `userid=${userId}; path=/; httpOnly; expires=${getCookieExpires()}`)
        }

        res.end( JSON.stringify(blogData) )
      })
      return
    }


    // 处理user路由
    const userResult = handleUserRouter(req, res)
    if(userResult){
      userResult.then( userData => {
        if(userData){
          console.log('userData is ', userData)
          if(needSetCookie){
            res.setHeader('Set-Cookie', `userid=${userId}; path=/; httpOnly; expires=${getCookieExpires()}`)
          }
          res.end( JSON.stringify(userData) )
        }
      } )
      return
    }
    // const userData = handleUserRouter(req, res)
    // if(userData){
    //   res.end( JSON.stringify(userData) )
    //   return
    // }


    // 没有匹配到路由，返回404
    res.writeHead(404, {"Content-Type": 'text/plain'})
    res.write('404 Not Found')
    res.end()

  } )

}

module.exports = serverhandle


// process.env.NODE_ENV