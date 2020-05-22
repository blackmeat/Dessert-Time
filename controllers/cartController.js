const db = require("../models")
const Cart = db.Cart
const CartItem = db.CartItem
const Product = db.Product

const cartController = {
  postCart: (req, res) => {
    if (!req.body.productId) {
      req.flash("error_messages", "請選擇方案")
      res.redirect("back")
    }
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
                  return req.session.save(() => {
                    res.redirect("/cart")
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
      .findOne({
        where: { CartId: req.session.cartId },
        include: [Product]
      })
      .then((item) => {
        if (req.session.cartId && item) {
          res.render("cart", { product: item.Product })
        } else {
          res.redirect("/products/subscribe")
        }
      })

  }
}

module.exports = cartController