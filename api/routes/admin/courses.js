
const express = require('express');
const router = express.Router();

const { Course, Category, User, Chapter } = require('../../models');
const {Op} = require("sequelize");

const {
  NotFoundError,
  sendSuccessResponse,
  handleFailure
} = require('../../utils/responses');

// 获取课程列表
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
      ...getCondition(),
      order: [
        ['id', 'ASC']
      ],
      limit: pageSize,
      offset: startOffset
    }

    /*搜索部分----start*/
    if (query.categoryId) {
      condition.where = {
        categoryId: {
          [Op.eq]: query.categoryId
        }
      };
    }

    if (query.userId) {
      condition.where = {
        userId: {
          [Op.eq]: query.userId
        }
      };
    }

    if (query.name) {
      condition.where = {
        name: {
          [Op.like]: `%${ query.name }%`
        }
      };
    }

    if (query.recommended) {
      condition.where = {
        recommended: {
          // 需要转布尔值
          [Op.eq]: query.recommended === 'true'
        }
      };
    }

    if (query.introductory) {
      condition.where = {
        introductory: {
          [Op.eq]: query.introductory === 'true'
        }
      };
    }
    /*搜索部分----end*/

    // 查询
    const { count, rows} = await Course.findAndCountAll(condition);

    // 响应数据
    const data = {
      courses: rows,
      pagination: {
        pageSize,
        currentPage,
        total: count
      }
    }

    sendSuccessResponse(res,'获取课程列表成功', data);
  } catch(err) {
    handleFailure(res, err)
  }
});

// 获取课程详情
router.get('/:id', async (req, res, next) => {
  try {
    const course = await getCourse(req);

    sendSuccessResponse(res, `获取id为${req.params.id}的课程成功`, course)
  } catch(err) {
    handleFailure(res, err)
  }
});

// 新增课程
router.post('/', async (req, res, next) => {
  try {
    // 只接收title与content
    const createData = filterBody(req);
    createData.userId = req.user.id;

    const course = await Course.create(createData);

    sendSuccessResponse(res, '新增课程成功', course, 201);

  } catch(err) {
    handleFailure(res, err)
  }
});


// 删除课程
router.delete('/:id', async (req, res, next) => {
  try {
    const course = await getCourse(req);

    const count = await Chapter.count({
      where: {
        courseId: req.params.id
      }
    })
    // 避免孤儿数据
    if(count > 0) {
      throw new Error('该课程下还有章节，不能删除。');
    }
    await course.destroy();

    sendSuccessResponse(res, `删除id为${req.params.id}的课程成功`)

  } catch(err) {
    handleFailure(res, err)
  }
});

// 更新课程
router.put('/:id', async (req, res, next) => {
  try {
    const updateData = filterBody(req);

    const course = await getCourse(req);

    await course.update(updateData);

    sendSuccessResponse(res, `更新id为${req.params.id}的课程成功`, course)

  } catch(err) {
    handleFailure(res, err);
  }
});

/**
 * 公共方法：白名单过滤
 * @param req
 * @returns {{image: *, name, introductory: (boolean|*), userId: (number|*), categoryId: (number|*), content, recommended: (boolean|*)}}
 */
function filterBody(req) {
  return {
    categoryId: req.body.categoryId,
    name: req.body.name,
    image: req.body.image,
    recommended: req.body.recommended,
    introductory: req.body.introductory,
    content: req.body.content
  };
}


async function getCourse(req) {
  const { id } = req.params;

  const course = await Course.findByPk(id, getCondition());

  if(!course) {
    throw new NotFoundError(`Id: ${ id } 的课程未找到。`);
  }

  return course;
}

const getCondition = () => {
  return {
    attributes: {
      exclude: ['CategoryId', 'UserId']
    },
    include: [
      {
        model: Category,
        as: 'category',
        attributes: ['id', 'name']
      },
      {
        model: User,
        as: 'user',
        attributes: ['id', 'username', 'avatar']
      }
    ]
  }
}

module.exports = router;