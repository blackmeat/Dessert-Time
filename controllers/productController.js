const db = require("../models")
const Product = db.Product

const productController = {
  getProducts: (req, res) => {
    Product
      .findAll()
      .then((products) => {
        res.render("products", { products })
      })
  }
}

module.exports = productController