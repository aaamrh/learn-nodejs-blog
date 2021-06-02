// 对应Blog集合
const mongoose = require('../db')

// 定义数据规范
const BlogSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: String,
  author: {
    type: String,
    require: true
  } 
}, {timestamps: true})


// modal collection
const Blog = mongoose.model('blog', BlogSchema)

module.exports = Blog
