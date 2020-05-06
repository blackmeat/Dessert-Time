const db = require("../models")
const Product = db.Product

const productController = {
  productsPage: (req, res) => {
    Product
      .findAll()
      .then((products) => {
        res.render("products", { products })
      })
  },
  subscribePage: (req, res) => {
    let productId = ''
    if (req.query.productId) {
      productId = Number(req.query.productId)
    }
    Product
      .findAll()
      .then((products) => {
        res.render("subscribe", { products, productId })
      })
  }
}

module.exports = productController