const helpers = require("../helpers")
const db = require("../models")
const imgur = require("imgur-node-api")
const User = db.User
const Order = db.Order
const Product = db.Product
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

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
    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID)
      imgur.upload(file.path, (err, img) => {
        return Product.create({
          name: req.body.name,
          english_name: req.body.english_name,
          price: req.body.price,
          description: req.body.description,
          image: file ? img.data.link : null,
        }).then((product) => {
          req.flash("success message", "商品新增成功！")
          res.redirect("/admin/products")
        })
      })
    } else {
      return Product.create({
        name: req.body.name,
        english_name: req.body.english_name,
        price: req.body.price,
        description: req.body.description,
        image: null,
      }).then((product) => {
        req.flash("success message", "商品新增成功！")
        res.redirect("/admin/products")
      })
    }

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
  getCancelOrders: (req, res) => {
    Order
      .findAll({
        where: { payment_status: "等待取消確認" },
        include: [Product, User]
      })
      .then((orders) => {
        // 每筆資料都有MerchantID & PostData
        orders = orders.map((order) => ({
          ...order.dataValues,
          MerchantID: helpers.cancelTradeInfo(order.amount, order.sn).MerchantID,
          PostData: helpers.cancelTradeInfo(order.amount, order.sn).PostData
        }))
        if (req.params.id) {
          Order
            .findByPk(req.params.id)
            .then((order) => {
              return res.render("admin/cancel", { orders, order })
            })
        } else {
          return res.render("admin/cancel", { orders })
        }
      })
  },
  putCancelOrders: (req, res) => {
    Order
      .findByPk(req.params.id)
      .then((order) => {
        order.update({
          ...order,
          payment_status: req.body.payment_status,
        }).then((order) => {
          res.redirect("/admin/cancel")
        })
      })
  }
}

module.exports = adminController

