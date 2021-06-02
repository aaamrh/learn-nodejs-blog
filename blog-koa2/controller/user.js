const { exec, escape } = require('../db/mysql')
const User = require('../db/models/User')

const login = async (username, password) => {

  // mysql
  username = escape(username)  // GET 预防sql注入
  password = escape(password)
  console.log(username, password)

  // mongodb
  const userMongo = await User.find({
    username,
    password
  })

  console.log('userMongo', userMongo)

  let sql = `
    select * from users where username=${username} and password=${password}
  `;

  const rows = await exec(sql)
  return rows[0] || {}

  return exec(sql).then(rows => {
    return rows[0] || {} 
  })
}


module.exports = {
  login
}