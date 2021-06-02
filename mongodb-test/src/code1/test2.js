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
      return
    }
    console.log('mogodb connect success')

    // 切换到数据库
    const db = client.db(dbName)

    // 使用集合
    const usersCollection = db.collection('users')

    // 新增
    // usersCollection.insertOne({
    //   username: 'lisi',
    //   realname: '李四',
    //   password: '123123'
    // }, (err, result)=>{
    //   if(err){console.log(err); return }
    //   console.log(result)
    // })

    // 更新
    usersCollection.updateOne({
      username: 'lisi',
    }, {$set:{ realname:'李斯' }}, (err, result)=>{
      if(err){console.log(err); return }
      console.log(result)
    })

    // // 删除
    // usersCollection.updateOne({
    //   username: 'lisi',
    // }, (err, result)=>{
    //   if(err){console.log(err); return }
    //   console.log(result)
    // })

    // 查询
    // usersCollection.find({
    //   username: 'zhangsan'
    // }).toArray((err, result)=>{
    //   if(err){
    //     console.log(err)
    //     return
    //   }
    //   console.log(result)
    // })

    // 关闭链接
    // client.close()

  }
)