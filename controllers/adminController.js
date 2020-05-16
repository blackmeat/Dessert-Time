const db = require("../models")
const User = db.User
const Order = db.Order
const Product = db.Product

const adminController = {
  getUsers: (req, res) => {
    User
      .findAll()
      .then((users) => {
        res.render("admin/users", { users })
      })
  },
  putUser: (req, res) => {
    User
      .findByPk(req.params.id)
      .then((user) => {
        user.update({
          ...user,
          role: !user.role
        }).then((user) => {
          res.redirect("/admin/users")
        })
      })
  },
  getProducts: (req, res) => {
    Product
      .findAll()
      .then((products) => {
        res.render("admin/products", { products })
      })
  },
  addProduct: (req, res) => {
    res.render("admin/product")
  },
  postProduct: (req, res) => {
    const { name, english_name, price, description } = req.body
    Product.create({
      name: name,
      english_name: english_name,
      price: price,
      description: description
    }).then((product) => {
      res.redirect("/admin/products")
    })
  },
  getOrders: (req, res) => {
    Order
      .findAll({
        order: [["createdAt", "DESC"]],
        include: [Product, User]
      })
      .then((orders) => {
        res.render("admin/orders", { orders })
      })
  },

}

module.exports = adminController