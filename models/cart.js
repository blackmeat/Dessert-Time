'use strict';
module.exports = (sequelize, DataTypes) => {
  const Cart = sequelize.define("Cart", {
  }, {});
  Cart.associate = function (models) {
    // associations can be defined here
    Cart.hasMany(models.CartItem)
  };
  return Cart;
};