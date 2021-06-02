const express = require('express')

const app = express()

app.use((req, res, next)=>{
  console.log('请求开始...', req.method, req.url)

  next()
})

app.use((req, res, next)=>{
 
  req.cookie = {
    uid: '123123'
  }

  next()
})

app.use((req, res, next)=>{
  // 异步
  setTimeout(()=>{
    req.body={
      a: 100
    }
    next()
  })
  
})

app.use('/api', (req, res, next)=>{
  console.log('处理API路由')
  next() 
})

app.get('/api', (req, res, next)=>{
  console.log('get 处理API路由')
  next() 
})

app.post('/api', (req, res, next)=>{
  console.log('post 处理API路由')
  next() 
})


app.get('/api/get-cookie', (req, res, next)=>{
  console.log('get getcookie,', )
  res.json({
    code: 0,
    data: req.cookie
  })
})


app.post('/api/get-post-data', (req, res, next)=>{
  console.log('post /get-post-data')
  res.json({
    code: 0,
    data: req.body
  })
})


app.use((req, res, next)=>{
  console.log('404 404 404')
  res.json({
    code: -1,
    msg: '404 404 404'
  })
})


app.listen(4000, ()=>{
  console.log('server is listening on 4000')
})