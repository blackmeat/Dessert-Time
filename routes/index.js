const userController = require("../controllers/userController")
const productController = require("../controllers/productController")



module.exports = (app) => {
  app.get("/", (req, res) => {
    res.redirect("/home")
  })
  app.get("/home", (req, res) => {
    res.render("home")
  })
  // Login
  app.get("/signup", userController.signUpPage)
  app.post("/signup", userController.signUp)
  app.get("/signin", userController.signInPage)
  app.post("/signin", userController.signIn)
  app.get("/logout", userController.logout)

  // Product 
  app.get("/products", productController.productsPage)
  app.get("/subscribe", productController.subscribePage)
}