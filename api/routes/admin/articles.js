
const express = require('express');
const router = express.Router();

const { Article } = require('../../models');

router.get('/', async (req, res, next) => {
  try {
    const condition = {
      order: [
        ['id','DESC']
      ]
    }
    
    const articles = await Article.findAll(condition);
    res.json({
      status: true,
      message: '获取文章列表成功',
      data: articles
    });
  } catch(err) {
    res.status(500).json({
      status: false,
      message: '获取文章列表失败',
      error: [err.message]
    });
  }
});

module.exports = router;