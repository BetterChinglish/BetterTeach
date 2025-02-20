
/*
* 自定义 404 错误类
* */
class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFoundError';
    this.code = 404;
  }
}

/**
 * 请求成功
 * @param res 响应
 * @param message 成功信息
 * @param data  响应体
 * @param code  响应code
 * */
function sendSuccessResponse(res, message, data = {}, code = 200) {
  res.status(code).json({
    status: true,
    message,
    data,
  })
}


function handleFailure(res, error) {
  if(error.name === 'SequelizeValidationError') {
    const errors = error.errors.map(e => e.message);
    return sendErrorResponse(res, '请求参数错误', errors, 400);
  }
  
  if(error.name === 'NotFoundError') {
    return sendErrorResponse(res, '资源不存在', [error.message], 404);
  }
  
  sendErrorResponse(res, '服务器错误', [error.message], 500);
}

function sendErrorResponse(res, errorMessage, errorsArr, errorCode) {
  return res.status(errorCode).json({
    status: false,
    message: errorMessage,
    errors: errorsArr,
  })
}


module.exports = {
  NotFoundError,
  sendSuccessResponse,
  failure
}