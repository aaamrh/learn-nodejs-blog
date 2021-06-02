class BaseModel{
  // data: obj , message: string
  constructor(data, message){
    // GET: 兼容当第一个参数就传 string
    if (typeof data === 'string') {
      this.message = data
      data = null
      message = null
    }

    if(data){ this.data = data }
    
    if(message){ this.message = message }
  }
}


class SuccessModel extends BaseModel{
  constructor(data, message){
    super(data, message)
    this.code = 0
  }
}

class ErrorModel extends BaseModel{
  constructor(data, message){
    super(data, message)
    this.code = -1
  }
}

module.exports = {
  SuccessModel,
  ErrorModel
}