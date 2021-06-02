const MongodbClient= require('mongodb').MongoClient

const url = 'mongodb://localhost:27017'
const dbName = 'test'

MongodbClient.connect(
  url, 
  {
    // 配置
    useUnifiedTopology: true
  },
  (err, client)=>{
    if(err){
      console.log(err)
    }
    console.log('mogodb connect success')

    // 切换到数据库
    const db = client.db(dbName)

    // 关闭链接
    client.close()

  }
)