const helpers = require("../helpers")
const nodemailer = require("nodemailer")
const db = require("../models")
const Order = db.Order
const CartItem = db.CartItem
const Product = db.Product
const transporter = nodemailer.createTransport({
  service: "gmail",
  secure: true,
  auth: {
    type: "OAuth2",
    user: "dasf2422@gmail.com",
    clientId: process.env.CLIENTID,
    clientSecret: process.env.CLIENTSECRET,
    refreshToken: process.env.REFRESHTOKEN,
  }
});

const orderController = {
  createOrder: (req, res) => {
    Order.create({
      subscriber_name: req.body.subscriber_name,
      subscriber_phone: req.body.subscriber_phone,
      subscriber_email: req.body.subscriber_email,
      name: req.body.name,
      phone: req.body.phone,
      address: req.body.address,
      amount: req.body.amount,
      shipping_status: req.body.shipping_status,
      payment_status: req.body.payment_status,
      UserId: req.body.userId,
      ProductId: req.body.productId
    }).then(order => {
      var mailOptions = {
        from: "dasf2422@gmail.com",
        to: `${order.subscriber_email}`,
        subject: `訂單成立通知信 #${order.id} `,
        text: `訂單成立通知信`,
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });
      CartItem
        .destroy({ where: { CartId: req.session.cartId } })
        .then((cartitem) => {
          return res.redirect(`/order/${order.id}/checkout`)
        })
    })
  },
  checkout: (req, res) => {
    Order
      .findByPk(req.params.id, { include: Product })
      .then(order => {
        if (order.UserId !== req.user.id) {
          return res.redirect("/users/orders")
        }
        const tradeInfo = helpers.getTradeInfo(order.amount, order.Product.name, order.subscriber_email)
        if (order.payment_status === "尚未付款" || order.payment_status === "付款失敗") {
          order.update({
            ...order,
            sn: tradeInfo.MerchantOrderNo
          }).then(order => {
            res.render("checkout", { order, tradeInfo })
          })
        } else {
          res.render("checkout", { order, tradeInfo })
        }

      })
  },
  spgatewayCallback: (req, res) => {
    console.log("===== spgatewayCallback =====")
    console.log(req.method)
    console.log(req.body)
    console.log("==========")

    const data = JSON.parse(helpers.create_mpg_aes_decrypt(req.body.Period))

    console.log("===== spgatewayCallback: create_mpg_aes_decrypt、data =====")
    console.log(data)

    if (data.Status === "SUCCESS") {
      Order
        .findOne({ where: { sn: data.Result.MerchantOrderNo } })
        .then(order => {
          order.update({
            ...order,
            payment_status: "完成付款",
          }).then(order => {
            order.save()
            return res.redirect(`/order/${order.id}/checkout`)
          })
        })
    } else {
      Order
        .findOne({ where: { sn: data.Result.MerchantOrderNo } })
        .then(order => {
          order.update({
            ...order,
            payment_status: "付款失敗",
          }).then(order => {
            order.save()
            return res.redirect(`/order/${order.id}/checkout`)
          })
        })
    }

  }
}

module.exports = orderController