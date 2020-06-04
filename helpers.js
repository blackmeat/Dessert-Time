const crypto = require("crypto")

const URL = process.env.URL
const MerchantID = process.env.MERCHANTID
const HashKey = process.env.HASHKEY
const HashIV = process.env.HASHIV
const PayGateWay = "https://ccore.newebpay.com/MPG/period"
const ReturnURL = URL + "/newebpay/callback?from=ReturnURL"
const NotifyURL = URL + "/newebpay/callback?from=NotifyURL"
const BackURL = URL + "/users/orders"

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

function getTradeInfo(Amt, Desc, email) {
  const PeriodType = Desc === "體驗一箱" ? "D" : "M"
  const PeriodPoint = Desc === "體驗一箱" ? 2 : 14
  const PeriodTime = Desc === "體驗一箱" ? 1 : 12
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
    "PeriodType": PeriodType, // 交易週期
    "PeriodPoint": PeriodPoint, // 交易週期時間點
    "PeriodStartType": 2, // 檢查卡號模式（共三種）
    "PeriodTimes": PeriodTime, // 交易期數
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

function cancelTradeInfo(Amt, sn) {
  sn = sn + "_1"
  data = {
    "RespondType": "JSON", // 回傳格式
    "Version": 1.0, // 串接程式版本
    "Amt": Amt, // 取消授權金額
    "MerchantOrderNo": sn, // 商店訂單編號
    "IndexType": 1, // 單號類別 1為商店訂單編號 2為藍新金流交易單號
    "TimeStamp": Date.now(), // 時間戳記
  }

  console.log("===== getCancelInfo: data =====")
  console.log(data)

  mpg_aes_encrypt = create_mpg_aes_encrypt(data)

  console.log("===== getCancelTradeInfo: mpg_aes_encrypt =====")
  console.log(mpg_aes_encrypt)

  CancelInfo = {
    "MerchantID": MerchantID, // 商店代號
    "PostData": mpg_aes_encrypt, // 加密後參數
    "MerchantOrderNo": data.MerchantOrderNo,
  }

  console.log("===== getCancelTradeInfo: cancelInfo =====")
  console.log(CancelInfo)

  return CancelInfo
}

function ensureAuthenticated(req) {
  return req.isAuthenticated();
}

function getUser(req) {
  return req.user;
}

function cartId(req) {
  return req.session.cartId
}

module.exports = {
  genDataChain,
  create_mpg_aes_encrypt,
  create_mpg_aes_decrypt,
  getTradeInfo,
  cancelTradeInfo,
  ensureAuthenticated,
  getUser,
  cartId,
}