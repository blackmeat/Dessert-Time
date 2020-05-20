const moment = require("moment")
module.exports = {
  ifCond: function (a, b, options) {
    if (a === b) {
      return options.fn(this)
    }
    return options.inverse(this)
  },
  ifNotCond: function (a, b, options) {
    if (a !== b) {
      return options.fn(this)
    }
    return options.inverse(this)
  },
  textSub_a: function (a) {
    return String(a).substring(0, 13)
  },
  textSub_b: function (a) {
    return String(a).substring(13, 24)
  },
  textSub_c: function (a) {
    return String(a).substring(24)
  },
  date: function (a) {
    return moment(a).format("YYYY-MM-DD HH:mm:ss")
  },
  due: function (a) {
    return moment(a).add(1, "years").format("YYYY年MM月")
  }
}