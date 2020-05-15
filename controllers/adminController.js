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
  getOrders: (req, res) => {
    Order
      .findAll({
        order: [["createdAt", "DESC"]],
        include: [Product, User]
      })
      .then((orders) => {
        res.render("admin/orders", { orders })
      })
  }
}

module.exports = adminController