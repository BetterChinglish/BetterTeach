'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Article extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Article.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        // 必须传
        notNull: {
          msg: '标题必须存在'
        },
        // 不能为空字符串
        notEmpty: {
          msg: '标题不能为空'
        },
        // 限制长度
        len: {
          args: [2, 45],
          msg: '标题的长度需要在2~45个字符之间'
        }
      }
    },
    content: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Article',
  });
  return Article;
};