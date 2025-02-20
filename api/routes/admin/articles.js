
const express = require('express');
const router = express.Router();

const { Article } = require('../../models');
const {Op} = require("sequelize");

// 获取文章列表
router.get('/', async (req, res, next) => {
  try {
    // 获取查询参数
    let { title, pageSize, currentPage } = req.query;
    
    // 处理分页参数与默认值
    pageSize = Math.abs(parseInt(pageSize) || 10);
    currentPage = Math.abs(parseInt(currentPage) || 1);
    
    // 分页, limit startOffset, pageSize
    const startOffset = (currentPage - 1) * pageSize;
    
    // 排序
    const condition = {
      order: [
        ['id', 'ASC']
      ],
      limit: pageSize,
      offset: startOffset
    }
 
    // 模糊查询title, where title like xxx
    if(title) {
      condition.where = {
        title:{
          [Op.like]: `%${title}%`
        }
      }
    }
    
    // 查询
    const { count, rows: data} = await Article.findAndCountAll(condition);
    
    // 返回数据
    res.json({
      status: true,
      message: '获取文章列表成功',
      data,
      pagination: {
        pageSize,
        currentPage,
        total: count
      }
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
    // 只接收title与content
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
    if(err.name === 'SequelizeValidationError') {
      const error = err.errors.map(e => e.message);
      res.status(400).json({
        status: false,
        message: '新增文章失败',
        error
      });
      return;
    }
    
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

// 更新文章
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    
    const article = await Article.findByPk(id);
    
    if(!article) {
      throw new findArticleError(404, `id为${id}的文章不存在`);
    }
    
    article.title = title;
    article.content = content;
    
    await article.save();
    
    res.json({
      status: true,
      message: `更新id为${id}的文章成功`,
      data: article
    });
    
  } catch(err) {
    const { id } = req.params;
    const code = err.code || 500;
    res.status(code).json({
      status: false,
      message: `更新id为${id}的文章失败`,
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