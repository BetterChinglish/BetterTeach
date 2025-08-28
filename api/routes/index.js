const express = require('express');
const router = express.Router();

const {Course, Category, User} = require('../models');
const {sendSuccessResponse, handleFailure} =
  require('../utils/responses');

router.get('/', async (req, res) => {
  try {
    // 推荐课程
    const recommendedCourses = await Course.findAll({
      attributes: {
        exclude: ['CategoryId', 'UserId', 'content'],
      },
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name'],
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'nickname', 'avatar', 'company'],
        }
      ],
      where: {recommended: true},
      order: [['id', 'DESC']],
      limit: 10,
    });

    // 人气课程
    const likesCourses = await Course.findAll({
      attributes: {exclude: ['CategoryId', 'UserId', 'content']},
      order: [['likesCount', 'desc'], ['id', 'desc']],
      limit: 10
    });

    // 入门课程
    const introductoryCourses = await Course.findAll({
      attributes: { exclude: ['CategoryId', 'UserId', 'content'] },
      where: { introductory: true },
      order: [['id', 'desc']],
      limit: 10
    });

    sendSuccessResponse(res, '获取首页数据成功。', {
      recommendedCourses,
      likesCourses,
      introductoryCourses
    });



  } catch (error) {
    handleFailure(res, error);
  }
})

module.exports = router;
