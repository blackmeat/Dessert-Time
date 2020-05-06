const bcrypt = require("bcrypt-nodejs")
const db = require("../models")
const User = db.User

const userController = {
  getMyAccount: (req, res) => {
    res.render("myaccount")
  },
  signUp: (req, res) => {
    if (req.body.password !== req.body.passwordCheck) {
      req.flash("error_messages", "兩次密碼輸入不相同")
      return res.redirect("/signup")
    } else {
      User
        .findOne({ where: { email: req.body.email } })
        .then((user) => {
          if (user) {
            req.flash("error_messages", "信箱已經被註冊過")
            return res.redirect("/signup")
          } else {
            User.create({
              name: req.body.name,
              email: req.body.email,
              password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null),
            }).then(user => {
              req.flash("success_messages", "成功註冊！！")
              return res.redirect('/signin')
            })
          }
        })
    }
  },

  signIn: (req, res) => {
    // console.log(req.headers)
    req.flash("success_messages", "成功登入")
    res.redirect("/home")
  },

  logout: (req, res) => {
    req.flash("success_messages", "已經成功登出")
    req.logout()
    res.redirect("/home")
  },
}

module.exports = userController