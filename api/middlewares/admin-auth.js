const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { UnauthorizedError } = require('../utils/errors');
const { sendSuccessResponse, handleFailure } = require('../utils/responses');

module.exports = async (req, res, next) => {
  try {
    // 获取请求头中的 token
    const { token } = req.headers;
    if(!token) {
      throw new UnauthorizedError('需要登陆后才能访问!');
    }

    // 验证 token 是否正确
    const decoded = jwt.verify(token, process.env.SECRET);

    // 从 jwt 中，解析出之前存入的 userId
    const { userId } = decoded;

    // 查询当前用户
    const user = await User.findByPk(userId);

    // 如果用户不存在
    if (!user) {
      throw new UnauthorizedError('用户不存在。')
    }

    // 验证当前用户是否是管理员，错误码后续统一常量处理
    if (user.role !== 100) {
      throw new UnauthorizedError('您没有权限使用当前接口。')
    }

    // 将用户信息存入请求对象，后续流程可以直接使用
    req.user = user;

    // 继续后续流程
    next();

  } catch (error) {
    handleFailure(res, error);
  }
};
