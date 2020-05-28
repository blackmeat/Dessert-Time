const db = require("../models")
const Cart = db.Cart
const CartItem = db.CartItem
const Product = db.Product

const cartController = {
  postCart: (req, res) => {
    if (!req.body.productId) {
      req.flash("error_messages", "請選擇方案")
      res.redirect("back")
    } else {
      return Cart.findOrCreate({
        where: {
          id: req.session.cartId || 0,
        },
      })
        .spread(function (cart, created) {
          CartItem
            .destroy({ where: { CartId: cart.id } })
            .then((cartitems) => {
              return CartItem.findOrCreate({
                where: {
                  CartId: cart.id,
                  ProductId: req.body.productId
                },
                default: {
                  CartId: cart.id,
                  ProductId: req.body.productId,
                }
              })
                .spread(function (cartItem, created) {
                  return cartItem.update({
                    quantity: 1,
                  }).then((cartItem) => {
                    req.session.cartId = cart.id
                    req.session.cartItem = cartItem
                    return req.session.save(() => {
                      res.redirect("/cart")
                    })
                  })
                })
            })
        });
    }

  },
  getCart: (req, res) => {
    console.log("===== Session & User Information =====")
    console.log(req.session)
    console.log(req.user)
    if (!req.session.cartId) {
      res.redirect("/products/subscribe")
    } else {
      CartItem
        .findOne({
          where: { CartId: req.session.cartId },
          include: [Product]
        })
        .then((item) => {
          if (item) {
            res.render("cart", { product: item.Product })
          } else {
            res.redirect("/products/subscribe")
          }
        })
    }
  }
}

module.exports = cartController