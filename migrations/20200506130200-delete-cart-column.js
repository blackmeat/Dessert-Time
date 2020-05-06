'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn("Carts", "ProductId", {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.addColumn("Carts", "ProductId", {
      type: Sequelize.INTEGER
    })
  }
};
