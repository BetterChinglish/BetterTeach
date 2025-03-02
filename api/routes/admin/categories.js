
const express = require('express');
const router = express.Router();

const { Category, Course } = require('../../models');
const {Op} = require("sequelize");

const {
  NotFoundError,
  sendSuccessResponse,
  handleFailure
} = require('../../utils/response');

// 获取分类列表
router.get('/', async (req, res, next) => {
  try {
    // 获取查询参数
    let { name, pageSize, currentPage } = req.query;
    
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
 
    // 模糊查询name, where name like xxx
    if(name) {
      condition.where = {
        name:{
          [Op.like]: `%${name}%`
        }
      }
    }
    
    // 查询
    const { count, rows} = await Category.findAndCountAll(condition);
    
    const data = {
      categories: rows,
      pagination: {
        pageSize,
        currentPage,
        total: count
      }
    }
    
    sendSuccessResponse(res,'获取分类列表成功', data)
  } catch(err) {
    handleFailure(res, err)
  }
});

// 获取分类详情
router.get('/:id', async (req, res, next) => {
  try {
    const category = await getCategory(req);
    
    sendSuccessResponse(res, `获取id为${req.params.id}的分类成功`, category)
  } catch(err) {
    handleFailure(res, err)
  }
});

// 新增分类
router.post('/', async (req, res, next) => {
  try {
    // 只接收name与rank
    const { name, rank } = req.body;
    
    const category = await Category.create({
      name,
      rank
    });
    
    sendSuccessResponse(res, '新增分类成功', category, 201);
    
  } catch(err) {
    handleFailure(res, err)
  }
});


// 删除分类
router.delete('/:id', async (req, res, next) => {
  try {
    const category = await getCategory(req);

    const count = await Course.count({ where: {categoryId: req.params.id} });
    if (count > 0) {
      throw new Error('分类下有课程，不能删除。');
    }

    await category.destroy();
    
    sendSuccessResponse(res, `删除id为${req.params.id}的分类成功`)
    
  } catch(err) {
    handleFailure(res, err)
  }
});

// 更新分类
router.put('/:id', async (req, res, next) => {
  try {
    const { name, rank } = req.body;
    
    const category = await getCategory(req);
    
    await category.update({name, rank});
    
    sendSuccessResponse(res, `更新id为${req.params.id}的分类成功`, category)
    
  } catch(err) {
    handleFailure(res, err);
  }
});

async function getCategory(req) {
  const { id } = req.params;

  const category = await Category.findByPk(id);
  
  if(!category) {
    throw new NotFoundError(`Id: ${ id } 的分类未找到。`);
  }
  
  return category;
}


module.exports = router;