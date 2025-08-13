const express = require('express');
const router = express.Router();
const { User } = require('../../models');
const { Op } = require('sequelize');
const {
  handleFailure,
  sendSuccessResponse,
  BadRequestError,
  UnauthorizedError,
  NotFoundError
} = require('../../utils/responses');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/**
 * 管理员登录
 * POST /admin/auth/sign_in
 */
router.post('/sign_in', async (req, res) => {
  try {
    const { login, password } = req.body;

    if(!login) {
      throw new BadRequestError('邮箱/用户名必须填写。');
    }

    if(!password) {
      throw new BadRequestError('密码必须填写。');
    }

    const condition = {
      where: {
        // email或username其一为login即可
        [Op.or]: [
          { email: login },
          { username: login }
        ]
      }
    };

    // 通过email或username，查询用户是否存在
    const user = await User.findOne(condition);

    // 没查找到用户则返回错误
    if (!user) {
      throw new NotFoundError('用户不存在，无法登录。');
    }

    // 比对密码
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if(!isPasswordValid) {
      throw new UnauthorizedError('密码错误。');
    }

    if(user.role !== 100) {
      throw new UnauthorizedError('无管理员后台权限。');
    }

    const token = jwt.sign({
      userId: user.id,
    }, process.env.SECRET, {
      expiresIn: '7d'
    })

    sendSuccessResponse(res, '登录成功。', {token});

  } catch (error) {
    handleFailure(res, error);
  }
});

module.exports = router;
