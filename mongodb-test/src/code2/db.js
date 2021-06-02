const mongoose = require('mongoose')

const url = 'mongodb://localhost:27017'
const dbName = 'test'

mongoose.set('useFindAndModify', false)

mongoose.connect(`${url}/${dbName}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

const db = mongoose.connection

db.on('error', err=>{
  console.log(err)
})

// 链接成功
db.on('open', ()=>{
  console.log('mongoose connect success...')
})


module.exports = mongoose