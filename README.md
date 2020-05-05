# PomoTodo-r

這個是一個以React和Electron所建立起的PomoTodo版本，雖然目標同樣是創建一個結合蕃茄鐘和待辦事項的APP，但這個版本的各個方面和PomoTodo主線不同。

關於PomoTodo原版的資訊，請參考：

https://github.com/DvIkero/PomoTodo

希望每一位使用者都能享受它。

## 啟動

如果您想要使用它，請確保您已經安裝了npm套件管理器並於main以及renderer資料夾下皆輸入以下指令：

```
npm install
```

若要啟動的話，請分別在兩個目錄下輸入以下指令：

```
npm start
```

## 安裝檔

受限於網盤流量，目前只打包Windows版本，若您要在其他平台上安裝，請考慮打包：

Windows: https://www.jianguoyun.com/p/DSmPh9gQ9byvCBjYwpUD

## 打包

包裝的相關參數您可以到package.json進行修改，若不修改，它將會被包裝為windows, mac os 以及 linux 三個版本:

[更多資訊](https://www.electron.build/)

首先，請到renderer資料夾下，輸入以下指令將react打包

```
npm run build
```

接著，若你沒有修改任何參數，你會看倒renderer下新建立的build資料夾，請將它複製到main/src底下，並且打開main/src/index.js，將

```javascript
win.loadURL(`http://localhost:3000`); 
```

修改為:

```javascript
win.loadURl(`file://${__dirname}/build/index.html`);
```

然後於main資料夾底下執行：

```
npm run build
```

若你沒有修改任何參數，打包好的檔案會位於main/build下
