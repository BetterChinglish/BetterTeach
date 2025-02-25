 
const express = require('express');
const router = express.Router();

const { User } = require('../../models');
const {Op} = require("sequelize");

const {
  NotFoundError,
  sendSuccessResponse,
  handleFailure
} = require('../../utils/response');

// 获取用户列表
router.get('/', async (req, res, next) => {
  try {
    // 获取查询参数
    let { pageSize, currentPage } = req.query;

    let query = req.query;

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
 
    // 模糊查询
    if (query.email) {
      condition.where = {
        email: {
          // eq: equal等于
          [Op.eq]: query.email
        }
      };
    }

    if (query.username) {
      condition.where = {
        username: {
          [Op.eq]: query.username
        }
      };
    }

    if (query.nickname) {
      condition.where = {
        nickname: {
          [Op.like]: `%${ query.nickname }%`
        }
      };
    }

    if (query.role) {
      condition.where = {
        role: {
          [Op.eq]: query.role
        }
      };
    }

    // 查询
    const { count, rows} = await User.findAndCountAll(condition);
    
    const data = {
      users: rows,
      pagination: {
        pageSize,
        currentPage,
        total: count
      }
    }
    
    sendSuccessResponse(res,'获取用户列表成功', data)
  } catch(err) {
    handleFailure(res, err)
  }
});

// 获取用户详情
router.get('/:id', async (req, res, next) => {
  try {
    const user = await getUser(req);
    
    sendSuccessResponse(res, `获取id为${req.params.id}的用户成功`, user)
  } catch(err) {
    handleFailure(res, err)
  }
});

// 新增用户
router.post('/', async (req, res, next) => {
  try {
    // 只接收title与content
    const updateData = filterBody(req);
    
    const user = await User.create(updateData);
    
    sendSuccessResponse(res, '新增用户成功', user, 201);
    
  } catch(err) {
    handleFailure(res, err)
  }
});

// 更新用户
router.put('/:id', async (req, res, next) => {
  try {
    const updateData = filterBody(req);
    
    const user = await getUser(req);
    
    await user.update(updateData );
    
    sendSuccessResponse(res, `更新id为${req.params.id}的用户成功`, user)
    
  } catch(err) {
    handleFailure(res, err);
  }
});

async function getUser(req) {
  const { id } = req.params;
  
  const user = await User.findByPk(id);
  
  if(!user) {
    throw new NotFoundError(`Id: ${ id } 的用户未找到。`);
  }
  
  return user;
}

function filterBody(req) {
  return {
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
    nickname: req.body.nickname,
    sex: req.body.sex,
    company: req.body.company,
    introduce: req.body.introduce,
    role: req.body.role,
    avatar: req.body.avatar,
  }
}

module.exports = router;