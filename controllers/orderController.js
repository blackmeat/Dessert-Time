const helpers = require("../helpers")
const nodemailer = require("nodemailer")
const db = require("../models")
const Order = db.Order
const CartItem = db.CartItem
const Product = db.Product
const Payment = db.Payment
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
      UserId: helpers.getUser(req).id,
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
        .destroy({ where: { CartId: helpers.cartId(req) } })
        .then((cartitem) => {
          req.session.cartItem = null
          return res.redirect(`/order/${order.id}/checkout`)
        })
    })
  },
  checkout: (req, res) => {
    Order
      .findByPk(req.params.id, { include: Product })
      .then(order => {
        if (!order) {
          return res.redirect("/users/orders")
        }
        if (order.UserId !== helpers.getUser(req).id) {
          return res.redirect("/users/orders")
        }
        const tradeInfo = helpers.getTradeInfo(order.amount, order.Product.name, order.subscriber_email)
        if (order.payment_status === "尚未付款" || order.payment_status === "付款失敗") {
          order.update({
            ...order,
            sn: tradeInfo.MerchantOrderNo
          }).then(order => {
            return res.render("checkout", { order, tradeInfo })
          })
        } else {
          return res.render("checkout", { order, tradeInfo })
        }
      })
  },
  newebpayCallback: (req, res) => {
    console.log("===== newebpayCallback =====")
    console.log(req.method)
    console.log(req.body)

    const data = JSON.parse(helpers.create_mpg_aes_decrypt(req.body.Period))

    console.log("===== newebpayCallback: create_mpg_aes_decrypt、data =====")
    console.log(data)

    const { Result } = data

    Order
      .findOne({ where: { sn: Result.MerchantOrderNo } })
      .then(order => {
        if (data.Status === "SUCCESS") {
          order.update({
            ...order,
            payment_status: "首期授權成功",
          })
            .then(order => {
              Payment.create({
                sn: Result.MerchantOrderNo,
                amount: Result.PeriodAmt,
                params: data.Message,
                paid_at: Date.now(),
                payment_method: "信用卡定期定額",
                OrderId: order.id,
              })
              return res.redirect(`/order/${order.id}/checkout`)
            })
        } else {
          order.update({
            ...order,
            payment_status: "付款失敗",
          }).then(order => {
            Payment.create({
              sn: Result.MerchantOrderNo,
              amount: Result.PeriodAmt,
              params: data.Message,
              paid_at: Date.now(),
              payment_method: "信用卡定期定額",
              OrderId: order.id,
            })
            return res.redirect(`/order/${order.id}/checkout`)
          })
        }
      })
  }
}

module.exports = orderController