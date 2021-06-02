const mysql = require('mysql')

// 创建链接对象
const con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'ma.1996',
  port: '3306',
  database: 'myblog'
})

// 开始链接
con.connect()

// 执行sql语句
const sql = 'select * from users;'

con.query(sql, (err, result)=>{
  if(err){
    console.error(err)
    return
  }

  console.log(result)
})

// 关闭链接
con.end()