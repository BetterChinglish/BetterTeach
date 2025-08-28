// 分类页面查询

const express = require('express');
const router = express.Router();

const { Category } = require('../models');
const { sendSuccessResponse, handleFailure } =
  require('../utils/responses');

/**
 * 查询分类列表
 * GET /categories
 */
router.get('/', async function (req, res, next) {
  try {
    // 查询所有分类，按rank升序，id降序排列
    const categories = await Category.findAll({
      order: [['rank', 'ASC'], ['id', 'DESC']]
    });

    sendSuccessResponse(res, '查询分类成功。', { categories });
  } catch (error) {
    handleFailure(res, error);
  }
});

module.exports = router;