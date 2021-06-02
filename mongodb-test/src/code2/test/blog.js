const Blog = require('../models/Blog')

!(async ()=>{
  // 模拟登录
  // const blogs = await Blog.find({
  //   title: /mongodb/   // 正则表达式 模糊查询
  // }).sort({_id:-1})
  // console.log(blogs)

  const res = await Blog.findOneAndUpdate(
    { _id: '60b6ed16f60359648329eada' },
    { content: '我在mongoose中修改了内容' },
    {
      new: true  // 返回修改后最新的内容 默认false 或返回修改之前的内容
    }
  )
  console.log(res)

  // 删除
  // const resDelete = await Blog.findOneAndDelete(
  //   {
  //     _id: '60b6ed16f60359648329eada',
  //     author: 'aaarmh'
  //   },
  // )
  // console.log(resDelete)

})()

