'use strict';
const bcrypt = require("bcryptjs")
module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.bulkInsert("Users", [{
      email: "root@example.com",
      password: bcrypt.hashSync("12345678", bcrypt.genSaltSync(10), null),
      role: true,
      name: "root",
      createdAt: new Date(),
      updatedAt: new Date()
    }], {})
    return queryInterface.bulkInsert("Products", [{
      name: "體驗一箱",
      english_name: "Experience Box",
      price: 549,
      image: "https://snacklips.com/wp-content/themes/snacklips/images/common/experience-box.png",
      description: "精選 4-6 種零食    擁有至少 3 個國家 適合單人獨享",
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      name: "超值箱",
      english_name: "Deluxe Box",
      price: 499,
      image: "https://snacklips.com/wp-content/themes/snacklips/images/common/intro-plan-1.png",
      description: "精選 6-8 種零食    擁有至少 3 個國家 適合單人獨享",
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      name: "饗樂箱",
      english_name: "Premium Box",
      price: 699,
      image: "https://snacklips.com/wp-content/themes/snacklips/images/common/intro-plan-2.png",
      description: "精選 9-11 種零食   擁有至少 3 個國家 適合雙人獨享",
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      name: "派對箱",
      english_name: "Party Box",
      price: 999,
      image: "https://snacklips.com/wp-content/themes/snacklips/images/common/intro-plan-3.png",
      description: "精選 12-18 種零食 擁有至少 5 個國家 適合多人獨享",
      createdAt: new Date(),
      updatedAt: new Date()
    }])
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.bulkDelete("Users", null, {})
    return queryInterface.bulkDelete("Products", null, {})
  }
};
