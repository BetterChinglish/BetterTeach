const express = require('express');
const router = express.Router();
const { sequelize, User } = require('../../models');
const { Op } = require('sequelize');
const {
  NotFoundError,
  sendSuccessResponse,
  handleFailure
} = require('../../utils/response');

/**
 * 统计用户性别-饼图
 * GET /admin/charts/sex
 */
router.get('/sex', async function (req, res) {
  try {
    const male = await User.count({ where: { sex: 0 } });
    const female = await User.count({ where: { sex: 1 } });
    const unknown = await User.count({ where: { sex: 2 } });

    const data = [
      { value: male, name: '男性' },
      { value: female, name: '女性' },
      { value: unknown, name: '未选择' }
    ];

    sendSuccessResponse(res, '查询用户性别成功。', { data });

  } catch (error) {
    handleFailure(res, error);
  }
});

/**
 * 统计每个月用户数量-折线图
 * GET /admin/charts/user
 */
router.get('/user', async (req, res) => {
  try {

    success(res, '查询每月用户数量成功。', {  });
  } catch (error) {
    failure(res, error);
  }
});


module.exports = router;
