const db = require("../models")
const Cart = db.Cart
const CartItem = db.CartItem
const Product = db.Product

const cartController = {
  postCart: (req, res) => {
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
                })
                  .then((cartItem) => {
                    req.session.cartId = cart.id
                    return req.session.save(() => {
                      return res.redirect("/cart")
                    })
                  })
              })
          })
      });
  },
  getCart: (req, res) => {
    console.log(req.session.cartId)
    console.log(req.user)
    CartItem
      .findOne({ where: { CartId: req.session.cartId } })
      .then((item) => {
        Product
          .findOne({ where: { id: item.ProductId } })
          .then((product) => {
            if (req.session.cartId) {
              res.render("cart", { product })
            } else {
              res.redirect("/products/subscribe")
            }
          })
      })

  }
}

module.exports = cartController