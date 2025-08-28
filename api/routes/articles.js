const express = require('express');
const router = express.Router();
const { Article } = require('../models');
const { sendSuccessResponse, handleFailure } = require('../utils/responses');
const { NotFoundError } = require("../utils/errors");

/**
 * 查询文章列表
 * GET /articles
 */
router.get('/', async function (req, res) {
  try {
    const query = req.query;
    const currentPage = Math.abs(Number(query.currentPage)) || 1;
    const pageSize = Math.abs(Number(query.pageSize)) || 10;
    const offset = (currentPage - 1) * pageSize;

    const condition = {
      attributes: { exclude: ['content'] },
      order: [['id', 'DESC']],
      limit: pageSize,
      offset: offset
    };

    const { count, rows } = await Article.findAndCountAll(condition);
    sendSuccessResponse(res, '查询文章列表成功。', {
      articles: rows,
      pagination: {
        total: count,
        currentPage,
        pageSize,
      }
    });
  } catch (error) {
    handleFailure(res, error);
  }
});

module.exports = router;
