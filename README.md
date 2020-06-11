# 異食嗑（Dessert Time）
本專案使用Node.js + Express + MYSQL並部署至Heroku上。
## 專案發想
當初覺得訂閱制的服務很有趣，就像KKBOX、Netflix每個月自動從帳戶扣款就可以使用服務，於是就想實作在自己的網站上看看。
## 專案網址
https://dessert-time.herokuapp.com/home
## 功能說明
### Completed
- 前台
  - 會員登入/註冊/登出
  - 首頁
  - 所有方案頁面
  - 選擇方案頁面
  - 填寫付款資訊頁面（成立訂單、重新選購方案）
  - 確認訂單成立頁面（立即付款）
  - 會員所有訂單頁面
  - 會員正在訂閱頁面
  - 會員個人資料頁面
  - 說明零食訂閱頁面

- 後台
  - 顯示所有使用者（切換管理員/一般會員）
  - 顯示所有方案（新增商品）
  - 顯示所有訂單內容
  - 顯示所有待取消訂單（取消信用卡授權）
  - 新增商品頁面增加“圖片上傳”
  - 待取消訂單頁面增加“修改訂單狀態”
### In progress
- 前台
  - 填寫付款資訊頁面增加“同付款人“  

- 資料表
  - 增加儲存”訂單備註“欄位
  - 增加儲存”會員填寫取消訂閱原因“欄位
  
## 測試帳號
- 管理員
  帳號：root@example.com
  密碼：12345678

## 專案建置
- 安裝第三方套件
```
$ npm install
```
- 建立資料庫
  - 使用MySQLWorkbench GUI
  - 輸入指令create database dessert
  
- 建立資料表
```
$ sequelize db:migrate
```
- 建立種子資料
```
$ sequelize db:seed:all
```
- 金流串接
  - 先申請藍新金流帳號（測試版）
https://cwww.newebpay.com/main/login_center/single_login
  - 會員中心 > 商店管理 > 開設商店
  - 點擊詳細資料進入商店 
  - 點擊信用卡一次付清申請啟用
  - 找出API串接金鑰(HashIV、HashKey)、商店代號

- 專案下建立.env檔案
```
MERCHANTID= ···
HASHKEY= ···
HASHIV= ···
```
- 取得模擬網址
```
$ ./ngrok http 3000
```
- 修改URL
  - 找到helpers檔案
  - 修改URL變數，將剛剛模擬網址複製上去

- 完成串接




