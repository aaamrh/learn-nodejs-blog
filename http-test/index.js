const http = require('http')
const querystring = require('querystring')

const server = http.createServer( (req, res) => {

  const url = req.url

  req.query = querystring.parse(url.split('?')[1])
  console.log('query', req.query)
  
  // res.end( JSON.stringify(req.query) )

  // post 请求
  if( req.method === 'POST' ){
    console.log('content-type: ', req.headers['content-type'])

    let postData = '';

    // 流式数据
    req.on('data', (chunk)=>{
      console.log( chunk )
      postData += chunk.toString()
    })

    // 当传送大数据的时候，需要接受一部分处理一部分数据
    req.on('end', ()=>{
      console.log( 'postData', postData )
      res.end( postData )
    })
  }

})


server.listen(8000)