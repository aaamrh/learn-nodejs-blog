    慕课网 Node开发Web Server博客 （Node.js+Express+Koa2+MySQL）

    ---npm i 插件 ，会把插件安装到node_modules目录中，不会修改package.json,
    ---npm i 插件 --save (-S) ，项目发布上线之后还会依赖用到的插件，没有这些插件，项目不能运行
    ---npm i 插件 --save-dev(-D) ，安装到开发依赖中，项目上线之后不会用到的插件，例如'babel-loader',项目解析完发布

# 原生
## 2-1 下载和安装

`nvm` 管理nodejs版本

## 2-5 debuger之inspect协议

nodejs debugger 未执行,  进入`chrome://inspect`

## 3-2 技术方案

    开发前一般要先考虑：
    1. 数据如何存储
    2. 如何对接前端，即接口设计

### 数据存储

    主要存储2点：博客、 用户

存储博客：
|  id   | title | content | createtime | author |
| :---: | :---: | :----:  |  :------:  |  :---:  |
|   1   | title |  内容   |  时间戳     |  铁头马  |

存储用户：
| id  | username |  pwd   | realname |
| :-: |   :-:    |   :-:  |    :-:   |
|  1  |  aaamrh  | qwe123 |   铁头马  |


接口设计：
| 描述  | 接口 |  方法  | url参数 |  备注  |
| :-:  |  :-: |  :-:  |   :-:   |  :-:  |
|  获取博客列表  |  `/api/blog/list` | `get` | author作者, kewords搜索关键字  |  |
|  获取一篇博客  |  `/api/blog/detail` | `get`  | id |  |
|  新增一篇博客  |  `/api/blog/new`    | `post` |    |  |
|  更新一篇博客  |  `/api/blog/update` | `post` | id |  |
|  删除一篇博客  |  `/api/blog/del`    | `post` | id |  |
|  登录         |  `/api/user/login`  | `post` |    | postData中有用户名和密码 |

## 4-1 http 概述

    浏览器输入url后发生了什么？

* DNS解析， 建立TCP链接， 发送http请求
* server接收到http请求， 处理， 并返回
* 客户端收到返回数据， 处理数据

## 4-5 搭建开发环境

`nodemon` 监测文件变化，自动重启node
`cross-env` 设置环境变量，兼容mac linux 和 windows

## 4-5 初始化路由

将服务和路由处理拆分开

## 4-8 Promise 的使用

## 5-2 数据库操作（增删改查）

    ``` sql
    insert into users(username, password, realname) values ('aaamrh', 'qwe213', '铁头马');

    select * from users;
    select id, username from users;
    select * from users where id=1 and `password`='qwe123';
    select * from users where username like '%mrh';
    select * from users where username like '%mrh' order by id desc;

    SQL_SAFE_UPDATES = 0;

    update users set realname='铁头马啊' where username='aaamrh'; 

    -- 删除用户一般不用delete，而是设置state状态，0代表用户不可用，1代表可用
    delete from users where id=100;

    ```

## 5-4 nodejs 操作数据库


## 6-2 Cookie - 介绍

    存储在浏览器端的一段字符串（最大5KB）

    跨域不共享

    每次发送http请求，会将请求域的cookie一起发送给server
    比如在淘宝中，请求一个百度的js文件，请求域是百度

    server可以修改cookie并返回给浏览器

    浏览器中也可以通过js修改cookie（有限制，server可以将不想浏览器修改，可以锁定cookie）

nodejs 通过 `req.headers.cookie` 获取

## 6-3 Cookie 用于登录验证

    后端设置cookie

    req.setHeader('Set-Cookie', `username=${val.username}; path=/`)


## 6-4 cookie做限制

```js
    // httpOnly 代表只允许后端修改
    req.setHeader('Set-Cookie', `username=${val.username}; path=/`; httpOnly)
```

## 6-6 session

将用户信息username等信息存入cookie会很危险， 而且cookie存储量也很小；
解决： cookie中存储userid， server端session存储用户信息

## 6-8 session 到 redis

    session是js变量，存放在 nodejs 进程中
    存在问题：
        1. 进程内存有限，访问量过大，内存暴增怎么办
        2. 正是上线运行时多线程，多进程之间无法共享内存

    redis:
        web server 最常用的缓存数据库, 数据放在内存中
        优点: 放在内存中读写速度快。
        缺点: 内存比较昂贵， 断电内存丢失。 内存成本高，可存储的数据量更小

    为什么 session 适合redis:
        session访问频繁, 对性能要求极高
        session可以不考虑断电丢失的问题（内存硬伤）
        session数据量不会很大（相比于mysql）
    为什么网站数据不适合用redis:
        操作频率不是太高（相比session操作）
        断电数据不能丢，比如文章。redis有丢失风险或者找回成本太高
        网站数据量太大，内存成本太高

``` javascript
    // KEYS * #查看已存在所有键的名字
    // keys a* #查看以a开头的key
    // DEL #删除一个key
    // EXISTS #检查是否存在
    // info #查看当先所有信息
    // info memory #查看内存信息
    // FLUSHDB #清空当前库
    // FLUSHALL #清空所有数据
```

## 6-10 nodejs链接redis的demo

`npm i redis --save`

``` js

const redis = require('redis')

// 创建客户端
const redisClient = redis.createClient(6379, '127.0.0.1')
redisClient.on('error', (err)=>{ console.error(err) })


// 测试
redisClient.set('myname', 'mrh', redis.print)
redisClient.get('myname', (err, val)=>{
  if(err){ console.log(); return }

  console.log('val is：', val)

  // 退出
  redisClient.quit()
})

```

## 7-1 开始

    日志：
        访问日志: access log(server端最重要的日志)
        自定义日志: (包括自定义事件， 错误记录等)

    nodejs文件操作： nodejs stream
    日志功能的开发和使用
    日志文件拆分(每天一个文件), 日志内容分析

## 7-2 文件操作

`/file-test`
    读文件 写文件 判断文件是否存在

## 7-6 写日志

## 7-7 拆分日志

linux的`crontab`命令, 即定时任务
`crontab -e` 编辑新任务
`crontab -l` 查看任务列表

```javascript
    // 设置定时任务
    // *****command
    // ***** 五个*分别代表: 分钟 小时 日 月 年
    // command 代表shell脚本 
    
    // *1*** 每天的第一个小时
    // 21*** 每天第一个小时的第二分钟
    // 1**** command  代表每1分钟执行一次command

    // 流程
    // 将 access.log 拷贝并重命名为 2021-04-12.access.log
    // 然后 清空 access.log 重新累积日志

    // copy.sh
    #!/bin/sh
    cd /logs
    cp asscess.log ${date +%Y-%m-%d}.log
    echo "" > access.log

    // shell 中执行
    crontab -e  
    * 0 * * * sh /path/copy.sh

```

### 日志分析

    日志是按行存储的, 使用nodejs的readline(基于stream, 效率高)

``` javascript

    const fs = require('fs')
    const path = require('path')
    const readline = require('readline')

    const fname = path.join(__dirname, 'a.txt')
    const readStream = fs.createReadStream(fname)

    const rl = readline.createInterface({
        input: readStream
    })

    rl.on('line', (linedata)=>{})

    rl.on('close', ()=>{ console.log('监听结束') })

```

## 8-1 sql注入

    sql注入: 窃取数据库内容
    XSS攻击: 窃取前端cookie内容
    有些攻击需要硬件和服务支持（OP [服务器运维人员] 支持）: 如DDOS

``` javascript
    // sql注入
    // 输入一个sql片段, 最终拼接成一段攻击代码
    // 预防措施, mysql的excspe函数处理内容即可

    // XSS攻击
    // 在页面展示内容中掺杂js代码, 以获取网页信息
    // 预防措施: 转换生成js的特殊字符

```

# Express

## 9-2 express-安装

脚手架: `express-generator`

`npm i express-generator -g`

生成项目: `express project`

设置运行端口: `"start": "set port=4000 && node ./bin/www"`

## 9-5 express中间件

## 9-8 express处理session

使用`express-session`和`connect-redis`, 原生是使用`redis`

## 中间件原理

1. app.use 用来注册中间件, 先收集
2. 遇到http请求, 根据path和method判断出发哪些
3. next触发下一个

# Koa2

## async / await 语法

见 `promist-test`

## 10-2 介绍koa2

脚手架 `koa-generator`
创建项目 `koa2 xxx`

## 10-5 session

`koa-generic-session` 、 `redis` 和 `koa-redis`

## 10-9 日志

`koa-morgan`

## PM2

* 进程守护 崩溃自动重启
* 启动多进程 充分利用CPU和内存
* 自带日志记录功能

### 常用命令

    # -i 4 (cluster mode 模式启动4个app.js的应用实例, 4个应用程序会自动进行负载均衡)

    pm2 start [--name XXX] [-i 4] [--watch]
    pm2 list 
    pm2 [restart/stop/delete/info/monit/logs] <appname>/<id> [--name XXX]

## 13 Mongodb 文档数据库

MySQL是以表格的形式存储，
redis是以key-value形式存储
Mongodb是以文档形式存储, 格式像JSON

mongodb数据库 - mysql数据库
mongodb集合 - mysql表
mongodb文档 - mysql一条数据

### 13-11 命令行操作mongodb

``` shell
    show dbs
    use [db name]
    show collections
    db.blogs.insert({name:'CSS世界'})
    db.blogs.find()
    db.blogs.find({"author": "aaamrh"})
    db.blogs.find({"author": "aaamrh"}).sort({ _id: -1 }).limit(10) # 按照id 倒序排序
    db.blogs.find({"author": /正则表达式/}) # 模糊查询

    db.blogs.update({"author": "aaamrh", {$set:{"title": "更新标题"}}})

    db.blogs.remove({}) # 同上
```

### 13-12 nodejs链接mongodb

安装: `npm i mongodb --save`
代码: `mongodb-test`

### 13-15 mongoose链接mongodb服务

    注意: 实际项目开发时, 要有数据格式的规范
    关键字: Schama Model

    Schema定义数据格式的规范
    以Model规范Collection

