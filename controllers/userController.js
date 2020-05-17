const bcrypt = require("bcrypt-nodejs")
const helpers = require("../helpers")
const db = require("../models")
const User = db.User
const Order = db.Order
const Product = db.Product

const userController = {
  getMyAccount: (req, res) => {
    console.log(req.session)
    let cartId = ""
    if (req.session.cartId) {
      cartId = req.session.cartId
    }
    if (req.user) {
      res.redirect("/")
    }
    return res.render("myaccount", { cartId })
  },
  signUp: (req, res) => {
    if (req.body.password !== req.body.passwordCheck) {
      req.flash("error_messages", "兩次密碼輸入不相同")
      return res.redirect("/my-account")
    } else {
      User
        .findOne({ where: { email: req.body.email } })
        .then((user) => {
          if (user) {
            req.flash("error_messages", "信箱已經被註冊過")
            return res.redirect("/my-account")
          } else {
            User.create({
              name: req.body.name,
              email: req.body.email,
              password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null),
              role: false
            }).then(user => {
              req.flash("success_messages", "成功註冊！！")
              return res.redirect("/my-account")
            })
          }
        })
    }
  },
  signIn: (req, res) => {
    req.flash("success_messages", "成功登入")
    if (req.session.cartId) {
      res.redirect("/cart")
    } else {
      res.redirect("/home")
    }
  },
  logout: (req, res) => {
    req.flash("success_messages", "已經成功登出")
    req.logout()
    res.redirect("/home")
  },
  getOrders: (req, res) => {
    Order
      .findAll({ where: { UserId: req.user.id }, order: [["createdAt", "DESC"]] })
      .then((orders) => {
        res.render("orders", { orders })
      })
  },
  getSubscribing: (req, res) => {
    Order
      .findAll({
        where: { payment_status: "完成付款" },
        include: [Product]
      })
      .then((orders) => {
        res.render("subscribing", { orders })
      })
  },
  getCancel: (req, res) => {
    Order
      .findByPk(req.params.id)
      .then((order) => {
        console.log(order.sn)
        const CancelInfo = helpers.cancelTradeInfo(order.amount, order.sn)
        res.render("cancel", { order, CancelInfo })
      })
  }
}

module.exports = userController