const redis = require('redis')
const { REDIS_CONF } = require('../conf/db')

// 创建客户端
const redisClient = redis.createClient(REDIS_CONF.port, REDIS_CONF.host)
redisClient.on('error', (err)=>{ console.error(err) })


function set(key, val){
  if( typeof val === 'object' ){
    val = JSON.stringify(val)
  }
  redisClient.set(key, val, redis.print)
}

function get(key){
  return new Promise((resolve, reject) => {
    redisClient.get(key, (err, val)=>{
      console.log('err', err)
      if(err){ console.log(); return }


      if(val == null){
        resolve(null)
        return
      }

      try{
        resolve( JSON.parse(val) )
      }catch(err){
        resolve( val )
      }

    })
  })
}

module.exports = {
  get, 
  set
}
