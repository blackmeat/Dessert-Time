const userController = require("../controllers/userController")
const productController = require("../controllers/productController")
const cartController = require("../controllers/cartController")


module.exports = (app) => {
  const authenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next()
    }
    res.redirect('/signin')
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
  app.get("/signup", userController.signUpPage)
  app.post("/signup", userController.signUp)
  app.get("/signin", userController.signInPage)
  app.post("/signin", userController.signIn)
  app.get("/logout", userController.logout)

  // Product 
  app.get("/products", productController.productsPage)
  app.get("/subscribe", productController.subscribePage)
  // Cart 
  app.post("/cart", cartController.postCart)
}