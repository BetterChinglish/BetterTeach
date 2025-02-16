'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    // 循环生成 100 条数据
    const articles = [];
    const counts = 100;
    
    for(let i = 0; i < counts; i++) {
      articles.push({
        title: `文章的标题 ${i + 1}`,
        content: `文章的内容 ${i + 1}`,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    // 批量插入数据
    await queryInterface.bulkInsert('Articles', articles, {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    // 删除所有数据
    await queryInterface.bulkDelete('Articles', null, {});
  }
};
