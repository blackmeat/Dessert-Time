'use strict';
module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    name: DataTypes.STRING,
    english_name: DataTypes.STRING,
    price: DataTypes.INTEGER,
    image: DataTypes.STRING,
    descritption: DataTypes.TEXT
  }, {});
  Product.associate = function(models) {
    // associations can be defined here
  };
  return Product;
};