
const express = require('express');
const router = express.Router();

const { Setting } = require('../../models');

const {
  NotFoundError,
  sendSuccessResponse,
  handleFailure
} = require('../../utils/response');


// 获取系统设置详情
router.get('/', async (req, res, next) => {
  try {
    const setting = await getSetting();
    
    sendSuccessResponse(res, `获取系统设置成功`, setting)
  } catch(err) {
    handleFailure(res, err)
  }
});

 // 更新系统设置
router.put('/', async (req, res, next) => {
  try {
    const { name, icp, copyright } = req.body;

    const setting = await getSetting();
    
    await setting.update({ name, icp, copyright });
    
    sendSuccessResponse(res, `更新系统设置成功`, setting)
    
  } catch(err) {
    handleFailure(res, err);
  }
});

async function getSetting(req) {
  const setting = await Setting.findOne();

  if(!setting) {
    throw new NotFoundError(`系统设置信息 未找到。`);
  }

  return setting;
}


module.exports = router;