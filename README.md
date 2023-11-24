# 餐廳清單 (Restaurant List)
此專案為 ALPHA Camp Dev C3 M3 指標作業 所製作。  
運用 Node.js 建立本機伺服器，並透過 Express 與 Template Engine (Handlebars) 建立簡易的餐廳清單網頁。  
於 Dev C4後端 M1 指標作業 中加入資料庫（MySQL）以及 CRUD 的應用。  
於 Dev C4後端 M2 指標作業 中加入排序功能、分頁功能，以及 middlewares 應用。  
於 Dev C4後端 M3 指標作業 中加入註冊帳號與登入功能。

## 版本
- v3.0.0 (2023.11.24) ⭐️ 目前版本
  - 資料庫新增使用者資料，並建立使用者與餐廳資料之關聯。
  - 新增使用者註冊帳號與登入功能，以及透過 Oath2.0 進行 Facebook 登入。
- v2.1.0 (2023.11.09) 
  - 重構路由並加入 middlewares 應用。
  - 新增排序功能。
  - 新增分頁功能並優化資料庫處理。
  - 加入處理結果的提示訊息。
- v2.0.1 (2023.11.05) 
  - 修正編輯畫面無法正確帶入既有說明內容的問題
- v2.0.0 (2023.11.04) 
  - 增加「新增餐廳」、「刪除餐廳」、「編輯餐廳」功能
  - UI調整
- v1.0.0 (2023.10.02)

## 功能 (Features)
- 使用者可註冊帳號，或透過 Facebook 登入建立帳號。
- 使用者可以帳號密碼或 Facebook 登入系統。
- 使用者登入後，可進行以下功能操作：
  - ~~自靜態 json 檔載入並~~ 列出餐廳清單於首頁。  
    → v2.0.0版改為從MySQL資料庫中取得餐廳資料
  - 檢視個別餐廳的詳細資訊頁面。
  - 透過餐廳的 中英文名稱、種類、地址、電話、描述 來搜尋。
  - 可自行新增餐廳，並將資料儲存於資料庫中。
  - 可刪除餐廳資料。
  - 可編輯餐廳資料。
  - 可選擇餐廳列表的排序方式。

## 執行環境 (RTE)
[Node.js](https://nodejs.org/) (v18.18.0)  
[MySQL](https://dev.mysql.com/downloads/mysql/) (v8.0.35)  
ℹ️ *執行此專案前，需安裝 Node.js 與 MySQL。*

## 安裝 (Installation)
1. 開啟終端機 (Terminal)，cd 至存放本專案的資料夾，執行以下指令將本專案 clone 至本機電腦。

```
git clone https://github.com/letitia-chiu/restaurant-list.git
```

2. 進入此專案資料夾

```
cd restaurant-list
```

3. 執行以下指令以安裝套件

```
npm install
```

4. 資料庫設定  

執行以下指令以快速建立資料庫、資料表，以及匯入種子資料：

```
npm run setup-db
```
⚠️ **執行上述指令前，請先確認是否需更改預設設定**  
--- MySQL server 之預設設定如下：
```
hostname: 'localhost'
user: 'root'
password: 'password'
database: 'restaurant'
```
若欲更改設定，請編輯專案資料夾根目錄下的 `create-db.js` 檔，並將修改後的設定同步更新至 `/config/config.json` 中的 "development"  
  
您也可以透過以下指令分別執行資料庫建立、資料表建立、匯入種子資料：
```
npm run db:create
```
```
npm run db:migrate
```
```
npm run db:seed
```

5. 環境變數設定

請參照根目錄下的 `.env.example` 檔，於根目錄下新增 `.env` 檔並進行相關設定：
```
SESSION_SECRET= 【 請自行設定 】
FACEBOOK_CLIENT_ID= 【 請自行設定 】
FACEBOOK_CLIENT_SECRET= 【 請自行設定 】

FACEBOOK_CALLBACK_URL=http://localhost:3000/oauth2/redirect/facebook
```
請自行設定 SESSION_SECRET、FACEBOOK_CLIENT_ID、FACEBOOK_CLIENT_SECRET。  
（若無 Facebook Client Id / secret，請先取得，否則無法使用 Facebook 登入）  
FACEBOOK_CALLBACK_URL 建議依照  `.env.example` 預設值設定即可，若欲更改，需同步修改登入/登出路由 `./routes/login-logout.js` 中的路由設定：
```
router.get('/oauth2/redirect/facebook', passport.authenticate('facebook', {
  successRedirect: '/restaurants',
  failureRedirect: '/login',
  failureFlash: true
}))
```
此處的 '/oauth2/redirect/facebook' 需與 FACEBOOK_CALLBACK_URL 之設定同步。

6. 啟動伺服器

啟動伺服器前，請先設置環境變數 NODE_ENV=development，再執行以下指令以啟動伺服器：

```
npm run start
```

若使用 mac/linux 系統，亦可直接透過以下指令設置環境變數並啟動伺服器：
```
npm run start:dev
```

當 Terminal 出現以下字樣，即代表伺服器啟動成功：  
`Express server is running on http://localhost:3000`  
現在，您可開啟任一瀏覽器輸入 http://localhost:3000 來使用餐廳清單網頁。  
種子資料提供以下兩組帳號密碼可使用：
- 帳號：user1@example.com / 密碼：12345678
- 帳號：user2@example.com / 密碼：12345678


## 使用工具 (Tools)
- 開發環境：[Visual Studio Code](https://visualstudio.microsoft.com/zh-hant/)
- 應用程式框架：[Express v4.18.2](https://www.npmjs.com/package/express)
- 樣版引擎：[Express-Handlebars v7.1.2](https://www.npmjs.com/package/express-handlebars)
- 資料庫套件：[mysql2 v3.2.0](https://www.npmjs.com/package/mysql2)
- ORM：[Sequelize v6.30.0 & Sequelize-CLI 6.6.0](https://sequelize.org/)
- HTTP method套件：[method-override v3.0.0](https://www.npmjs.com/package/method-override)
- 樣式框架：[Bootstrap v5.3](https://getbootstrap.com/docs/5.3/getting-started/download/)
- 字體圖標工具：[Font Awesome](https://fontawesome.com/)
- [connect-flash v0.1.1](https://www.npmjs.com/package/connect-flash)
- [express-session v1.17.3](https://www.npmjs.com/package/express-session)
- [dotenv v16.0.3](https://www.npmjs.com/package/dotenv)
- [bcryptjs v2.4.3](https://www.npmjs.com/package/bcryptjs)
- [passport v0.6.0](https://www.npmjs.com/package/passport)
- [passport-local v3.0.0](https://www.npmjs.com/package/passport-local)
- [passport-facebook v1.0.0](https://www.npmjs.com/package/passport-facebook)

## 開發者 (Contributor)
[Letitia Chiu](https://github.com/letitia-chiu)
