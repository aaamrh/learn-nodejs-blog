const redis = require('redis')

// 创建客户端
const redisClient = redis.createClient(6379, '127.0.0.1')
redisClient.on('error', (err)=>{
  console.error(err)
})


// 测试
redisClient.set('myname', 'mrh', redis.print)
redisClient.get('myname', (err, val)=>{
  if(err){
    console.log()
    return
  }

  console.log('val is：', val)


  // 退出
  redisClient.quit()
})