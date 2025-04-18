
const express = require('express');
const router = express.Router();

const { Article } = require('../../models');
const {Op} = require("sequelize");

const {
  NotFoundError,
  sendSuccessResponse,
  handleFailure
} = require('../../utils/response');

// 获取文章列表
router.get('/', async (req, res, next) => {
  try {
    // 获取查询参数
    const query = req.query;
    
    // 处理分页参数与默认值
    const pageSize = Math.abs(parseInt(query.pageSize) || 10);
    const currentPage = Math.abs(parseInt(query.currentPage) || 1);
    
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
    if(query.title) {
      condition.where = {
        title:{
          [Op.like]: `%${query.title}%`
        }
      }
    }
    
    // 查询
    const { count, rows} = await Article.findAndCountAll(condition);
    
    const data = {
      articles: rows,
      pagination: {
        pageSize,
        currentPage,
        total: count
      }
    }
    
    sendSuccessResponse(res,'获取文章列表成功', data)
  } catch(err) {
    handleFailure(res, err)
  }
});

// 获取文章详情
router.get('/:id', async (req, res, next) => {
  try {
    const article = await getArticle(req);
    
    sendSuccessResponse(res, `获取id为${req.params.id}的文章成功`, article)
  } catch(err) {
    handleFailure(res, err)
  }
});

// 新增文章
router.post('/', async (req, res, next) => {
  try {
    // 只接收title与content
    const createData = filterBody(req);
    
    const article = await Article.create(createData);
    
    sendSuccessResponse(res, '新增文章成功', article, 201);
    
  } catch(err) {
    handleFailure(res, err)
  }
});


// 删除文章
router.delete('/:id', async (req, res, next) => {
  try {
    const article = await getArticle(req);
    
    await article.destroy();
    
    sendSuccessResponse(res, `删除id为${req.params.id}的文章成功`)
    
  } catch(err) {
    handleFailure(res, err)
  }
});

// 更新文章
router.put('/:id', async (req, res, next) => {
  try {
    const updateData = filterBody(req);
    
    const article = await getArticle(req);
    
    await article.update(updateData);
    
    sendSuccessResponse(res, `更新id为${req.params.id}的文章成功`, article)
    
  } catch(err) {
    handleFailure(res, err);
  }
});

function filterBody(req) {
  return {
    title: req.body.title,
    content: req.body.content
  }
}

async function getArticle(req) {
  const { id } = req.params;
  
  const article = await Article.findByPk(id);
  
  if(!article) {
    throw new NotFoundError(`Id: ${ id } 的文章未找到。`);
  }
  
  return article;
}


module.exports = router;