const express = require("express")
const Handlebars = require('handlebars')
const exhbs = require('express-handlebars');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access')
const passport = require("./config/passport")
const bodyParser = require("body-parser")
const session = require("express-session")
const flash = require("connect-flash")
const app = express()
const port = 3000

// handlebars
app.engine("handlebars", exhbs({
  defaultLayout: "main",
  helpers: require("./config/handlebars-helper.js"),
  handlebars: allowInsecurePrototypeAccess(Handlebars)
}))
app.set("view engine", "handlebars")

// body-parser
app.use(bodyParser.urlencoded({ extended: true }))

// static file
const static = express.static("public")
app.use(static)
app.use("/order/:id/checkout", static)
app.use("/products", static)
app.use("/users", static)
app.use("/admin", static)
app.use("/admin/products", static)

// session
const sessionParser = session({ secret: "12345", resave: false, saveUninitialized: false })
app.use(sessionParser)
app.use(flash())

// passport
app.use(passport.initialize())
app.use(passport.session())

// middleware
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  res.locals.user = req.user
  next()
})

// start server
app.listen(port, () => {
  console.log("Server /localhost:3000 is running!!!")
})

// load routes
require("./routes/index.js")(app)