'use strict';
module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define("Order", {
    sn: DataTypes.STRING,
    subscriber_name: DataTypes.STRING,
    subscriber_phone: DataTypes.STRING,
    subscriber_email: DataTypes.STRING,
    name: DataTypes.STRING,
    phone: DataTypes.STRING,
    address: DataTypes.STRING,
    amount: DataTypes.INTEGER,
    shipping_status: DataTypes.STRING,
    payment_status: DataTypes.STRING,
    UserId: DataTypes.INTEGER,
    ProductId: DataTypes.INTEGER
  }, {});
  Order.associate = function (models) {
    // associations can be defined here
    Order.hasMany(models.Payment)
    Order.belongsTo(models.User)
    Order.belongsTo(models.Product)
  };
  return Order;
};