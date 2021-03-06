'use strict';
module.exports = (sequelize, DataTypes) => {
  const Payment = sequelize.define("Payment", {
    sn: DataTypes.STRING,
    amount: DataTypes.INTEGER,
    params: DataTypes.TEXT,
    paid_at: DataTypes.DATE,
    payment_method: DataTypes.STRING,
    OrderId: DataTypes.INTEGER
  }, {});
  Payment.associate = function (models) {
    // associations can be defined here
    Payment.belongsTo(models.Order)
  };
  return Payment;
};