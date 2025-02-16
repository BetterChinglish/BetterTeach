
const express = require('express');
const router = express.Router();

const { Article } = require('../../models');

router.get('/', async (req, res, next) => {
  try {
    // 排序
    const condition = {
      order: [
        ['id','DESC']
      ]
    }
    
    // 查询
    const articles = await Article.findAll(condition);
    
    // 返回数据
    res.json({
      status: true,
      message: '获取文章列表成功',
      data: articles
    });
  } catch(err) {
    // 错误
    res.status(500).json({
      status: false,
      message: '获取文章列表失败',
      error: [err.message]
    });
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const article = await Article.findByPk(id);
    
    if(!article) {
      throw new findArticleError( 404, `id为${id}的文章不存在`);
    }
    
    res.json({
      status: true,
      message: `获取id为${id}的文章成功`,
      data: article
    });
    
  } catch(err) {
    const { id } = req.params;
    const code = err.code || 500;
    res.status(code).json({
      status: false,
      message: `获取id为${id}的文章失败`,
      error: [err.message]
    });
  }
});


class findArticleError extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
  }
}

module.exports = router;