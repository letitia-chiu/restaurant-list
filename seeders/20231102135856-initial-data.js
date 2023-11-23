'use strict';

const initialData = require('../public/jsons/restaurant.json').results
initialData.forEach((data) => {
  if (data.id <= 4) data.userId = 1
  else data.userId = 2

  delete data.id
  data.createdAt = new Date()
  data.updatedAt = new Date()
})

const initialUsers = Array.from({ length: 2 }, (_, i) => ({
  id: i + 1,
  name: `user${i + 1}`,
  email: `user${i + 1}@example.com`,
  password: '12345678',
  createdAt: new Date(),
  updatedAt: new Date()
}))

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    let transaction

    try {
      transaction = await queryInterface.sequelize.transaction()

      await queryInterface.bulkInsert('Users', initialUsers, { transaction })
      await queryInterface.bulkInsert('Restaurants', initialData, { transaction })

      await transaction.commit()
    } catch (error) {
      if (transaction) transaction.rollback()
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null)
  }
};
