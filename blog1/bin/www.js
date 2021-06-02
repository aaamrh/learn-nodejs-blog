const http = require('http')

const PORT = 8000
const serverhandle = require('../app')

const server = http.createServer( serverhandle )

server.listen( PORT )