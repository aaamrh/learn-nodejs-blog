const { exec, escape } = require('../db/mysql')

const login = (username, password) => {
  username = escape(username)  // GET 预防sql注入
  password = escape(password)


  let sql = `
    select * from users where username=${username} and password=${password}
  `

  return exec(sql).then(rows => {
    return rows[0] || {}
  })

  if(username === 'mrh' && password === 'qwe123'){
    return true
  }

  return false
}


module.exports = {
  login
}