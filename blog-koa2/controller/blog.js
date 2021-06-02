const xss = require('xss')
const { exec } = require('../db/mysql')


const getList = async (author, keyword) => {
  // 先返回假数据
  let sql = 'select * from blogs where 1=1 '

  if(author){
    sql += `and author='${author}' `
  }

  if(keyword){
    sql += `and title like '%${keyword}%' `
  }

  sql += `order by createtime desc;`

  return await exec(sql)
}


const getDetail = async (id) => {
  let sql = `select * from blogs where id=${id}`

  // 文章详情不能是一个数组
  const rows = await exec(sql)
  return rows[0]

  // GET 对比下上面的写法
  return await exec(sql).then(rows => {
    return rows[0]
  })
}
    

const newBlog = async (blogData={}) => {
  // blogData 是一个博客对象，包含 title content 属性
  const title  = xss(blogData.title)  // GET XSS攻击预防
  // const title  = blogData.title  // GET XSS攻击预防
  const content = xss(blogData.content )
  const author = blogData.author 
  const createtime = Date.now()

  let sql = `
    insert into blogs (title, content, author, createtime)
    values ('${title}', '${content}', '${author}', ${createtime});
  `;

  const insertData = await exec(sql)
  return {
    id: insertData.insertId
  }

  return exec(sql).then(insertData => {
    console.log( 'newBlog insertData: ', insertData )
    return {
      id: insertData.insertId
    }
  })
}

const updateBlog = async (id, blogData={}) => {
  const title = blogData.title;
  const content = blogData.content;

  let sql = `update blogs set title='${title}', content='${content}' where id=${id};`

  const updateData = await exec(sql)
  if(updateData.affectedRows > 0){
    return true
  }

  return false
}


const deleteBlog = async (id, author) => {
  let sql = `delete from blogs where id=${id} and author='${author}';`

  const deleteData = exec(sql)
  if(deleteData.affectedRows > 0){
    return true
  }
  return false 
}


module.exports = {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  deleteBlog
}