const userController = require("../controllers/userController")



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
}