# 一起點餐｜GitHub Pages ＋ GAS ＋ Google 試算表

這次是從原本 GAS 網頁搬到 GitHub Pages 的轉換包，不是已部署網站。前端放 GitHub，訂單仍由你現有的 GAS 和試算表處理。保留原管理密碼、歷史團購、訂單和私人資料夾。

## 你只需要處理這兩個資料夾

- `frontend/`：上傳到專用的 GitHub 儲存庫 `ordering-system` 根目錄。
- `gas/`：這次更換 GAS 的 `Code.gs`，新增 HTML 檔 `Bridge`（貼 `Bridge.html`）。你原有的 `Index.html` 可以留著，不必再更新。

`tests/` 是測試檔，不用上傳 GAS，也不用部署 GitHub。

## 一次性設定

1. 在 GitHub 建立公開儲存庫 `ordering-system`。將 `frontend/` **裡面的檔案**上傳到儲存庫根目錄：`index.html`、`app.js`、`style.css`、`transport.js`、`config.js`；`.nojekyll` 可一併加入。
2. 儲存庫 Settings → Pages → Source 選 Deploy from a branch，選 `main` 與 `/ (root)`，儲存。等待 GitHub 顯示實際網站網址；常見形式為 `https://你的帳號.github.io/ordering-system/`，請以實際顯示的網址為準。
3. GAS 更換 `Code.gs`，新增 HTML 檔 `Bridge`，貼上 `Bridge.html`；`appsscript.json` 與原版相同，除非原本未設定，否則不用再換。儲存。
4. GAS「專案設定 → 指令碼屬性」新增 **FRONTEND_URL**，值填第2步的完整 GitHub Pages 網址（含 `/ordering-system/` 路徑與尾端 `/`）。原有 **ADMIN_PASSWORD** 與 **OUTPUT_FOLDER_ID** 保留。
5. GAS「部署 → 管理部署作業 → 鉛筆」選「新版本」再部署，沿用原部署。執行身分仍為「我」，存取者為「所有人」。
6. 在 GitHub 編輯 `config.js`，將 `gasUrl` 改成你現有的正式 GAS `/exec` 網址，儲存。**不要填管理密碼。**
7. 開 GitHub Pages 網址 →「進入主揪管理」→原管理密碼→選店家開團。新點餐連結會使用 GitHub 網址。

首次轉換需要換一次 GAS 後端。此後改排版、入口、點餐畫面只需更新 GitHub，不必改 GAS；新增餐廳只要增加菜單工作表。計費、儲存等後端功能改動仍可能需要更新 GAS。

## 新餐廳怎麼加入

沿用你的這份主菜單試算表：
https://docs.google.com/spreadsheets/d/1vRrE6jlZNR4mo5TQfbQh3rHBRz4bc0hQCYjeRPBCKH4/edit

**一個工作表＝一家餐廳。工作表名稱＝店名。**

當你把新菜單放進這個資料夾：
https://drive.google.com/drive/folders/1T5yPIuytrnpdl4Xg5B0siJ3UM-xLRFoA

通知我「幫我匯入○○餐廳菜單」，我就能讀取來源，新增店名工作表、填入品項與價格，核對難以辨識的內容。這是由你發出指令後進行的工作，並非網站自動辨識圖片，也不是已啟用資料夾監控。

完成後，管理頁按「重新整理訂單」，店家選單會重新讀取全部菜單工作表。直接選新餐廳開團即可，不用改 GitHub 或 GAS 的餐廳清單。

來源文字模糊、價格不明或有複雜套餐搭配時，先核對規格，不會自行猜價。

### 飲料店格式

| A 飲品 | B M單價（元） | C L單價（元） | D 甜度 | E 冰塊 | F 加料 |
| --- | --- | --- | --- | --- | --- |
| 紅茶 | 30 | 40 |  |  |  |
| 鮮果茶 | 60 | 75 | 最低一分糖 | 正常冰／少冰／微冰／去冰 | 珍珠／茶凍 |

第一格使用「飲品」。分類列只填 A 欄、價格空白。D／E 留空使用一般選項；F 留空使用珍珠10／茶凍15／奶蓋15。可用 F `加珍珠+10／加椰果+15` 自訂加料。季緣原圖限制僅套用於店名「季緣」；其他店不會自動套用免費珍珠。

### 一般餐廳格式

| A 餐點 | B 單價（元） | C 留空 | D 留空 | E 留空 | F 加料 |
| --- | --- | --- | --- | --- | --- |
| 招牌便當 | 100 |  |  |  | 加蛋+15／加飯+10 |
| 雞腿便當 | 120 |  |  |  |  |

第一格使用「餐點」或「品項」，B 單價、C 留空表示「單份」。餐點預設不顯示甜度與冰塊，也不套用飲料加料。

兩種規格可使用 B `小份單價`、C `大份單價`，或者 B `單點單價`、C `套餐單價`。每個規格價錢都需要由菜單明確提供。超過兩種規格可拆成不同品項；任選多道配餐等複雜套餐需要另外擴充，這一版不會自動處理。

菜單第一列是標題、A 品名，B／C 是價格，D／E 是甜冰允許選項，F 是加料。品項名稱不得重複；相同名稱不同搭配請使用清楚不同的名稱。工作表名稱不要以 `_` 開頭，該前綴為系統忽略的內部頁籤。

## 訂單與歷史紀錄

- 每團建立私人試算表，檔名 `店名_日期`，同日再開團加 `_02`、`_03`。
- 個人金額、點餐明細、餐點規格彙總與全團總計都保留；相同姓名合併金額，同名者請加姓氏或部門。
- 開團會保存菜單及加料價格；之後更新菜單只影響新團。
- 原 GAS 團購連結仍可打開，會顯示「開啟點餐網站」入口，帶到相同團的 GitHub 新網址。
- 管理密碼只存 GAS 指令碼屬性；不放到公開 GitHub。
- GitHub 的網頁原始碼是公開的，姓名訂單只保存在原本私人資料夾。

## 更新網站

只要把新版 `frontend` 檔案更新至相同儲存庫，GitHub Pages 完成發佈後，重新整理同一網址即可。不要把 `gas/Code.gs` 上傳到前端當網頁。

若要我直接更新你的 GitHub，需要提供實際儲存庫連結並有可用寫入權限；只有在聊天裡產生檔案不會自動更新 GitHub。你尚未提供帳號或儲存庫連結，因此本次沒有建立儲存庫或發佈網站。

## 初次上線必測

先開季緣測試團，無痕視窗送兩杯 M 青韻茶王加珍珠，應為130元；核對試算表。再開一般餐廳測試團，確認不顯示甜冰、加料金額正確。收單後確認不能新增。用手機實測；若瀏覽器擋住 Google iframe／第三方連線，可能需調整瀏覽器或公司的存取政策。

程式使用 GitHub 頁面內的 GAS 連線橋接，避免 `no-cors` 盲送。橋接檢查網站來源、每次連線隨機碼、指定方法與回覆識別碼。計費與管理權限仍由 GAS 檢查。若送單回覆中斷，按「重試送出」會使用原訂單識別碼，避免重複新增。

本機測試與 JavaScript 語法已驗證；真實 GitHub＋GAS iframe、Google 授權、權限及多人同時送單需要部署後驗證。此包尚未發佈成可用網址。

官方文件：
- https://developers.google.com/apps-script/reference/html/html-output
- https://developers.google.com/apps-script/guides/html/restrictions
- https://docs.github.com/en/pages/quickstart
