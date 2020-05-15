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
}

module.exports = adminController