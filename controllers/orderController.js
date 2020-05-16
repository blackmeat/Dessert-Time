require("dotenv").config()
const crypto = require("crypto")
const nodemailer = require("nodemailer")
const db = require("../models")
const Order = db.Order
const CartItem = db.CartItem
const Product = db.Product

const transporter = nodemailer.createTransport({
  service: "gmail",
  secure: true,
  auth: {
    type: "OAuth2",
    user: "dasf2422@gmail.com",
    clientId: process.env.CLIENTID,
    clientSecret: process.env.CLIENTSECRET,
    refreshToken: process.env.REFRESHTOKEN,
  }
});
const URL = ""
const MerchantID = process.env.MERCHANTID
const HashKey = process.env.HASHKEY
const HashIV = process.env.HASHIV
const PayGateWay = "https://ccore.spgateway.com/MPG/period"
const ReturnURL = URL + "/spgateway/callback?from=ReturnURL"
const NotifyURL = URL + "/spgateway/callback?from=NotifyURL"
const BackURL = URL + "/order"

function genDataChain(TradeInfo) {
  let results = [];
  for (let kv of Object.entries(TradeInfo)) {
    results.push(`${kv[0]}=${kv[1]}`);
  }
  return results.join("&");
}

function create_mpg_aes_encrypt(TradeInfo) {
  let encrypt = crypto.createCipheriv("aes256", HashKey, HashIV);
  let enc = encrypt.update(genDataChain(TradeInfo), "utf8", "hex");
  return enc + encrypt.final("hex");
}

function create_mpg_aes_decrypt(TradeInfo) {
  let decrypt = crypto.createDecipheriv("aes256", HashKey, HashIV);
  decrypt.setAutoPadding(false);
  let text = decrypt.update(TradeInfo, "hex", "utf8");
  let plainText = text + decrypt.final("utf8");
  let result = plainText.replace(/[\x00-\x20]+/g, "");
  return result;
}

function getTradeInfo(Amt, Desc, email, ) {

  console.log("===== getTradeInfo =====")
  console.log(Amt, Desc, email)
  console.log("==========")
  data = {
    "RespondType": "JSON", // 回傳格式
    "TimeStamp": Date.now(), // 時間戳記
    "Version": 1.0, // 串接程式版本
    "MerOrderNo": Date.now(), // 商店訂單編號
    "ProdDesc": Desc, // 產品名稱
    "PeriodAmt": Amt, // 訂單金額
    "PeriodType": "M", // 交易週期
    "PeriodPoint": 14, // 交易週期時間點
    "PeriodStartType": 2, // 檢查卡號模式（共三種）
    "PeriodTimes": 12, // 交易期數
    "PayerEmail": email, // 付款人電子信箱
    "ReturnURL": ReturnURL, // 支付完成返回商店網址
    "NotifyURL": NotifyURL, // 支付通知網址/每期授權結果通知
    "BackURL": BackURL, // 支付取消返回商店網址
  }

  console.log("===== getTradeInfo: data =====")
  console.log(data)

  mpg_aes_encrypt = create_mpg_aes_encrypt(data)

  console.log("===== getTradeInfo: mpg_aes_encrypt =====")
  console.log(mpg_aes_encrypt)

  tradeInfo = {
    "MerchantID": MerchantID, // 商店代號
    "PostData": mpg_aes_encrypt, // 加密後參數
    "PayGateWay": PayGateWay,
    "MerchantOrderNo": data.MerOrderNo,
  }

  console.log("===== getTradeInfo: tradeInfo =====")
  console.log(tradeInfo)

  return tradeInfo
}


const orderController = {
  createOrder: (req, res) => {
    Order.create({
      subscriber_name: req.body.subscriber_name,
      subscriber_phone: req.body.subscriber_phone,
      subscriber_email: req.body.subscriber_email,
      name: req.body.name,
      phone: req.body.phone,
      address: req.body.address,
      amount: req.body.amount,
      shipping_status: req.body.shipping_status,
      payment_status: req.body.payment_status,
      UserId: req.body.userId,
      ProductId: req.body.productId
    }).then(order => {
      var mailOptions = {
        from: "dasf2422@gmail.com",
        to: `${order.subscriber_email}`,
        subject: `訂單成立通知信 #${order.id} `,
        text: `訂單成立通知信`,
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });
      CartItem
        .destroy({ where: { CartId: req.session.cartId } })
        .then((cartitem) => {
          return res.redirect(`/order/${order.id}/checkout`)
        })
    })
  },
  checkout: (req, res) => {
    Order
      .findByPk(req.params.id, { include: Product })
      .then(order => {
        const tradeInfo = getTradeInfo(order.amount, order.Product.name, order.subscriber_email)
        if (order.payment_status === "尚未付款" || order.payment_status === "付款失敗") {
          order.update({
            ...order,
            sn: tradeInfo.MerchantOrderNo
          }).then(order => {
            res.render("checkout", { order, tradeInfo })
          })
        } else {
          res.render("checkout", { order, tradeInfo })
        }

      })
  },
  spgatewayCallback: (req, res) => {
    console.log("===== spgatewayCallback =====")
    console.log(req.method)
    console.log(req.body)
    console.log("==========")

    const data = JSON.parse(create_mpg_aes_decrypt(req.body.Period))

    console.log("===== spgatewayCallback: create_mpg_aes_decrypt、data =====")
    console.log(data)

    if (data.Status === "SUCCESS") {
      Order
        .findOne({ where: { sn: data.Result.MerchantOrderNo } })
        .then(order => {
          order.update({
            ...order,
            payment_status: "完成付款",
          }).then(order => {
            order.save()
            return res.redirect(`/order/${order.id}/checkout`)
          })
        })
    } else {
      Order
        .findOne({ where: { sn: data.Result.MerchantOrderNo } })
        .then(order => {
          order.update({
            ...order,
            payment_status: "付款失敗",
          }).then(order => {
            order.save()
            return res.redirect(`/order/${order.id}/checkout`)
          })
        })
    }

  }
}

module.exports = orderController