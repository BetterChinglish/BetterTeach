
const express = require('express');
const router = express.Router();

const { Article } = require('../../models');
const {Op} = require("sequelize");

// 获取文章列表
router.get('/', async (req, res, next) => {
  try {
    
    const { query, pageSize, currentPage } = req;
    
    // 排序
    const condition = {
      order: [
        ['id','DESC']
      ],
    }
 
    // 模糊查询title, where title like xxx
    if(query.title) {
      condition.where = {
        title:{
          [Op.like]: `%${query.title}%`
        }
      }
    }
    
    // 分页, limit startOffset, pageSize
    const startOffset = (currentPage - 1) * pageSize;
    
    
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

// 获取文章详情
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

// 新增文章
router.post('/', async (req, res, next) => {
  try {
    const { title, content } = req.body;
    
    const article = await Article.create({
      title,
      content
    });
    
    res.status(201).json({
      status: true,
      message: '新增文章成功',
      data: article
    });
    
  } catch(err) {
    res.status(err.code || 500).json({
      status: false,
      message: '新增文章失败',
      error: [err.message]
    });
  }
});


// 删除文章
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const article = await Article.findByPk(id);
    
    if(!article) {
      throw new findArticleError(404, `id为${id}的文章不存在`);
    }
    
    await article.destroy();
    
    res.json({
      status: true,
      message: `删除id为${id}的文章成功`
    });
    
  } catch(err) {
    const { id } = req.params;
    const code = err.code || 500;
    res.status(code).json({
      status: false,
      message: `删除id为${id}的文章失败`,
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