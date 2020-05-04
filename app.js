const express = require("express")
const exhbs = require("express-handlebars")
const passport = require("./config/passport")
const bodyParser = require("body-parser")
const session = require("express-session")
const flash = require("connect-flash")
const app = express()
const port = 3000

app.engine("handlebars", exhbs({
  defaultLayout: "main",
  helpers: require("./config/handlebars-helper.js")
}))
app.set("view engine", "handlebars")

app.use(bodyParser.urlencoded({ extended: true }))

app.use(express.static("public"))

const sessionParser = session({ secret: "12345", resave: false, saveUninitialized: false })
app.use(sessionParser)
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())

app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  res.locals.user = req.user
  next()
})

app.listen(port, () => {
  console.log("Server /localhost:3000 is running!!!")
})

require("./routes/index.js")(app)