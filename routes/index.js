const userController = require("../controllers/userController")
const productController = require("../controllers/productController")
const cartController = require("../controllers/cartController")
const orderController = require("../controllers/orderController")
const adminController = require("../controllers/adminController")
const helpers = require("../helpers")
const multer = require('multer')
const upload = multer({ dest: 'temp/' })


module.exports = (app, passport) => {
  const authenticated = (req, res, next) => {
    if (helpers.ensureAuthenticated(req)) {
      return next()
    }
    res.redirect("/my-account")
  }
  const authenticatedAdmin = (req, res, next) => {
    if (helpers.ensureAuthenticated(req)) {
      if (helpers.getUser(req).role === true) { return next() }
      return res.redirect("/")
    }
    res.redirect("/my-account")
  }
  // Home
  app.get("/", (req, res) => { res.redirect("/home") })
  app.get("/home", (req, res) => { res.render("home") })

  // Login
  app.get("/my-account", userController.getMyAccount)
  app.post("/signup", userController.signUp)
  app.post("/signin", passport.authenticate("local",
    { failureRedirect: "/my-account", failureFlash: true }), userController.signIn)
  app.post("/logout", userController.logout)

  // User
  app.get("/users/:id/profile", authenticated, userController.getProfile)
  app.put("/users/profile", authenticated, userController.putProfile)
  app.get("/users/orders", authenticated, userController.getOrders)
  app.get("/users/subscribing", authenticated, userController.getSubscribing)
  app.get("/users/:id/cancel", authenticated, userController.getCancel)
  app.put("/users/:id/cancel", authenticated, userController.putCancel)
  // app.put("/users/restore/:id", authenticated, userController.putCancelRestore)

  // Product 
  app.get("/products", productController.productsPage)
  app.get("/products/explain", productController.explainPage)
  app.get("/products/subscribe", productController.subscribePage)

  // Cart 
  app.get("/cart", authenticated, cartController.getCart)
  app.post("/cart", cartController.postCart)

  // Order
  app.post("/order", authenticated, orderController.createOrder)
  app.get("/order/:id/checkout", authenticated, orderController.checkout)

  // NewebPay
  app.post("/newebpay/callback", orderController.newebpayCallback)

  // Admin
  app.get("/admin/users", authenticatedAdmin, adminController.getUsers)
  app.put("/admin/users/:id", authenticatedAdmin, adminController.putUser)
  app.get("/admin/products", authenticatedAdmin, adminController.getProducts)
  app.get("/admin/products/add", authenticatedAdmin, adminController.addProduct)
  app.post("/admin/products", authenticatedAdmin, upload.single('image'), adminController.postProduct)
  app.delete("/admin/products/:id", authenticatedAdmin, adminController.deleteProduct)
  app.get("/admin/orders", authenticatedAdmin, adminController.getOrders)
  app.get("/admin/cancel", authenticatedAdmin, adminController.getCancelOrders)
  app.get("/admin/cancel/:id", authenticatedAdmin, adminController.getCancelOrders)
  app.put("/admin/cancel/:id", authenticatedAdmin, adminController.putCancelOrders)
}