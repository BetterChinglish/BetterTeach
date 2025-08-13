
const { NotFoundError, BadRequestError, UnauthorizedError } = require('./errors');


/**
 * 请求成功，发送成功响应
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

// 错误处理
function handleFailure(res, error) {
  if(error.name === 'SequelizeValidationError') {
    const errors = error.errors.map(e => e.message);
    return sendErrorResponse(res, '请求参数错误', errors, 400);
  }
  
  if(error.name === 'NotFoundError') {
    return sendErrorResponse(res, '资源不存在', [error.message], 404);
  }

  if(error.name === 'BadRequestError') {
    return sendErrorResponse(res, 'BadRequestError', [error.message], 400);
  }

  if(error.name === 'UnauthorizedError') {
    return sendErrorResponse(res, 'UnauthorizedError', [error.message], 401);
  }

  if (error.name === 'JsonWebTokenError') {
    return sendErrorResponse(res, '认证失败', [error.message], 401);
  }

  if (error.name === 'TokenExpiredError') {
    return sendErrorResponse(res, '认证失败', [error.message], 401);
  }
  
  sendErrorResponse(res, '服务器错误', [error.message], 500);
}

// 发送错误响应
function sendErrorResponse(res, errorMessage, errorsArr, errorCode) {
  return res.status(errorCode).json({
    status: false,
    message: errorMessage,
    errors: errorsArr,
  })
}


module.exports = {
  sendSuccessResponse,
  handleFailure,
  NotFoundError, BadRequestError, UnauthorizedError
}