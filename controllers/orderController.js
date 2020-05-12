require("dotenv").config()
const nodemailer = require("nodemailer")
const db = require("../models")
const Order = db.Order
const CartItem = db.CartItem
const Product = db.Product

const transporter = nodemailer.createTransport({
  service: 'gmail',
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
          console.log('Email sent: ' + info.response);
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
    Order.findByPk(req.params.id, { include: Product })
      .then(order => {
        console.log(order)
        res.render("checkout", { order })
      })
  }
}

module.exports = orderController