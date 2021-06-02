// 对应User集合
const mongoose = require('../db')

// 定义数据规范
const UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: String,
  realname: String 
})


// modal collection 
// GET mongoose 会将 user 变成 users 对应到collection中
// user1 -> user1 , userr -> userrs
const User = mongoose.model('user', UserSchema)

module.exports = User
