const ev = process.env.NODE_ENV

let MYSQL_CONF = {}
let REDIS_CONF = {}


if(ev === 'dev'){
  MYSQL_CONF = {
    host: 'localhost',
    user: 'root',
    password: 'ma.1996',
    port: '3306',
    database: 'myblog'
  },
  REDIS_CONF = {
    host: '127.0.0.1',
    port: '6379',
  }
}


if(ev === 'production'){
  MYSQL_CONF = {
    host: 'localhost',
    user: 'root',
    password: 'ma.1996',
    port: '3306',
    database: 'myblog'
  },
  REDIS_CONF = {
    host: '127.0.0.1',
    port: '6379',
  }
}


module.exports = {
  MYSQL_CONF,
  REDIS_CONF
}