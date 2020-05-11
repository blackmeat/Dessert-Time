const userController = require("../controllers/userController")
const productController = require("../controllers/productController")
const cartController = require("../controllers/cartController")
const orderController = require("../controllers/orderController")
const passport = require("../config/passport")


module.exports = (app) => {
  const authenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next()
    }
    res.redirect('/my-account')
  }
  const authenticatedAdmin = (req, res, next) => {
    if (req.isAuthenticated()) {
      if (req.user.role === true) { return next() }
      return res.redirect('/')
    }
    res.redirect('/signin')
  }
  app.get("/", (req, res) => { res.redirect("/home") })
  app.get("/home", (req, res) => { res.render("home") })
  // Login
  app.get("/my-account", userController.getMyAccount)
  app.post("/signup", userController.signUp)
  app.post("/signin", passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
  app.post("/logout", userController.logout)

  // Product 
  app.get("/products", productController.productsPage)
  app.get("/subscribe", productController.subscribePage)
  // Cart 
  app.get("/cart", authenticated, cartController.getCart)
  app.post("/cart", cartController.postCart)
  // Order
  app.post("/order", authenticated, orderController.createOrder)
  app.get("/checkout", authenticated, orderController.checkout)
}