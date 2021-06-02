const User = require('../models/User')

!(async ()=>{
  // const wangmazi = await User.create({
  //   username: 'wangmazi',
  //   password: '123',
  //   realname: '王五'
  // })
  // console.log(wangmazi)

  // const list = await User.find()
  // console.log(list)

  // 模拟登录
  const zhangsan = await User.find({
    username: 'zhangsan',
    password: 'qwe12'
  })
  console.log(zhangsan)
  

})()

