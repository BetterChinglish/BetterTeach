
const express = require('express');
const router = express.Router();

const { Chapter, Course } = require('../../models');
const {Op} = require("sequelize");

const {
  NotFoundError,
  sendSuccessResponse,
  handleFailure
} = require('../../utils/responses');

// 获取章节列表
router.get('/', async (req, res, next) => {
  try {
    // 获取查询参数
    const query = req.query;
    
    // 处理分页参数与默认值
    const pageSize = Math.abs(parseInt(query.pageSize) || 10);
    const currentPage = Math.abs(parseInt(query.currentPage) || 1);
    
    // 分页, limit startOffset, pageSize
    const startOffset = (currentPage - 1) * pageSize;

    // 如果没有课程id则无法查询章节
    if (!query.courseId) {
      throw new Error('获取章节列表失败，课程ID不能为空。');
    }

    const condition = {
      ...getCondition(),
      order: [['rank', 'ASC'], ['id', 'ASC']],
      limit: pageSize,
      offset: startOffset
    };

    condition.where = {
      courseId: {
        [Op.eq]: query.courseId
      }
    };

    if (query.title) {
      condition.where = {
        title: {
          [Op.like]: `%${ query.title }%`
        }
      };
    }


    // 查询
    const { count, rows} = await Chapter.findAndCountAll(condition);
    
    const data = {
      chapters: rows,
      pagination: {
        pageSize,
        currentPage,
        total: count
      }
    }
    
    sendSuccessResponse(res,'获取章节列表成功', data)
  } catch(err) {
    handleFailure(res, err)
  }
});

// 获取章节详情
router.get('/:id', async (req, res, next) => {
  try {
    const chapter = await getChapter(req);
    
    sendSuccessResponse(res, `获取id为${req.params.id}的章节成功`, chapter)
  } catch(err) {
    handleFailure(res, err)
  }
});

// 新增章节
router.post('/', async (req, res, next) => {
  try {
    // 只接收title与content
    const createData = filterBody(req);
    
    const chapter = await Chapter.create(createData);
    
    sendSuccessResponse(res, '新增章节成功', chapter, 201);
    
  } catch(err) {
    handleFailure(res, err)
  }
});


// 删除章节
router.delete('/:id', async (req, res, next) => {
  try {
    const chapter = await getChapter(req);
    
    await chapter.destroy();
    
    sendSuccessResponse(res, `删除id为${req.params.id}的章节成功`)
    
  } catch(err) {
    handleFailure(res, err)
  }
});

// 更新章节
router.put('/:id', async (req, res, next) => {
  try {
    const updateData = filterBody(req);
    
    const chapter = await getChapter(req);
    
    await chapter.update(updateData);
    
    sendSuccessResponse(res, `更新id为${req.params.id}的章节成功`, chapter)
    
  } catch(err) {
    handleFailure(res, err);
  }
});

/**
 * 公共方法：白名单过滤
 * @param req
 * @returns {{rank: (number|*), video: (string|boolean|MediaTrackConstraints|VideoConfiguration|*), title, courseId: (number|*), content}}
 */
function filterBody(req) {
  return {
    courseId: req.body.courseId,
    title: req.body.title,
    content: req.body.content,
    video: req.body.video,
    rank: req.body.rank
  };
}


async function getChapter(req) {
  const { id } = req.params;
  const condition = getCondition();
  
  const chapter = await Chapter.findByPk(id, condition);
  
  if(!chapter) {
    throw new NotFoundError(`Id: ${ id } 的章节未找到。`);
  }
  
  return chapter;
}


/**
 * 公共方法：关联课程数据
 * @returns {{include: [{as: string, model, attributes: string[]}], attributes: {exclude: string[]}}}
 */
function getCondition() {
  return {
    attributes: { exclude: ['CourseId'] },
    include: [
      {
        model: Course,
        as: 'course',
        attributes: ['id', 'name']
      }
    ]
  }
}



module.exports = router;