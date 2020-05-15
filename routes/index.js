const userController = require("../controllers/userController")
const productController = require("../controllers/productController")
const cartController = require("../controllers/cartController")
const orderController = require("../controllers/orderController")
const adminController = require("../controllers/adminController")
const passport = require("../config/passport")


module.exports = (app) => {
  const authenticate = passport.authenticate("local", { failureRedirect: "/my-account", failureFlash: true })
  const authenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next()
    }
    res.redirect("/my-account")
  }
  const authenticatedAdmin = (req, res, next) => {
    if (req.isAuthenticated()) {
      if (req.user.role === true) { return next() }
      return res.redirect("/")
    }
    res.redirect('/my-account')
  }
  app.get("/", (req, res) => { res.redirect("/home") })
  app.get("/home", (req, res) => { res.render("home") })
  // Login
  app.get("/my-account", userController.getMyAccount)
  app.post("/signup", userController.signUp)
  app.post("/signin", authenticate, userController.signIn)
  app.post("/logout", userController.logout)
  // User
  app.get("/users/orders", authenticated, userController.getOrders)
  // Product 
  app.get("/products", productController.productsPage)
  app.get("/products/subscribe", productController.subscribePage)
  // Cart 
  app.get("/cart", authenticated, cartController.getCart)
  app.post("/cart", cartController.postCart)
  // Order
  app.post("/order", authenticated, orderController.createOrder)
  app.get("/order/:id/checkout", orderController.checkout)
  // NewebPay
  app.post("/spgateway/callback", orderController.spgatewayCallback)
  // Admin
  app.get("/admin/users", authenticatedAdmin, adminController.getUsers)
}