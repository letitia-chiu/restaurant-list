'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('Restaurants', 'image', {
      allowNull: true,
      type: Sequelize.STRING
    });

    await queryInterface.changeColumn('Restaurants', 'google_map', {
      allowNull: true,
      type: Sequelize.STRING
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('Restaurants', 'image', {
      allowNull: false,
      type: Sequelize.STRING
    });

    await queryInterface.changeColumn('Restaurants', 'google_map', {
      allowNull: false,
      type: Sequelize.STRING
    });
  }
};
