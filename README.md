# 餐廳清單 (Restaurant List)
此專案為 ALPHA Camp Dev C3 M3 指標作業 所製作。  
運用 Node.js 建立本機伺服器，並透過 Express 與 Template Engine (Handlebars) 建立簡易的餐廳清單網頁。  
於 Dev C4後端 M1 指標作業 中加入資料庫（MySQL）以及 CRUD 的應用。

## 版本
- v2.0.1 (2023.11.05) 目前版本
  - 修正編輯畫面無法正確帶入既有說明內容的問題
- v2.0.0 (2023.11.04) 目前版本
  - 增加「新增餐廳」、「刪除餐廳」、「編輯餐廳」功能
  - UI調整
- v1.0.0 (2023.10.02)

## 功能 (Features)
- ~~自靜態 json 檔載入並~~ 列出餐廳清單於首頁。  
  → v2.0.0版改為從MySQL資料庫中取得餐廳資料
- 檢視個別餐廳的詳細資訊頁面。
- 透過餐廳的中英文名稱、種類、描述搜尋。
- 可自行新增餐廳，並將資料儲存於資料庫中。
- 可刪除餐廳資料。
- 可編輯餐廳資料。

## 執行環境 (RTE)
[Node.js](https://nodejs.org/) (v18.18.0)  
[MySQL](https://dev.mysql.com/downloads/installer/) (v8.0.35)  
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
5. 執行下列指令來啟動伺服器 

```
npm run start
```

當 Terminal 出現以下字樣，即代表伺服器啟動成功：  
`Express server is running on http://localhost:3000`  
現在，您可開啟任一瀏覽器輸入 http://localhost:3000 來使用餐廳清單網頁。

## 使用工具 (Tools)
- 開發環境：[Visual Studio Code](https://visualstudio.microsoft.com/zh-hant/)
- 應用程式框架：[Express v4.18.2](https://www.npmjs.com/package/express)
- 樣版引擎：[Express-Handlebars v7.1.2](https://www.npmjs.com/package/express-handlebars)
- 資料庫套件：[mysql2 v3.2.0](https://www.npmjs.com/package/mysql2)
- ORM：[Sequelize v6.30.0 & Sequelize-CLI 6.6.0](https://sequelize.org/)
- HTTP method套件：[method-override v3.0.0](https://www.npmjs.com/package/method-override)
- 樣式框架：[Bootstrap v5.3](https://getbootstrap.com/docs/5.3/getting-started/download/)
- 字體圖標工具：[Font Awesome](https://fontawesome.com/)

## 開發者 (Contributor)
[Letitia Chiu](https://github.com/letitia-chiu)
