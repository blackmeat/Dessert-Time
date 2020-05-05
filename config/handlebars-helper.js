module.exports = {
  ifCond: function (a, b, options) {
    if (a === b) {
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
  }
}