# PomoTodo-r

以React和Electron所建立，目标是创建一个结合蕃茄钟和待办事项的APP。

希望每一位使用者都能享受它。

## 启动

如果您想要使用它，请确保您已经安装了npm套件管理器并於main以及renderer资料夹下皆输入以下指令：

```
npm install
```

若要启动的话，请分别在两个目录下输入以下指令：

```
npm start
```

## 打包

包装的相关参数您可以到package.json进行修改，若不修改，它将会被包装为windows, mac os 以及 linux 三个版本:

[更多资讯](https://www.electron.build/)

首先，请到renderer资料夹下，输入以下指令将react打包

```
npm run build
```

接着，若你没有修改任何参数，你会看倒renderer下新建立的build资料夹，请将它复制到main/src底下，并且打开main/src/index.js，将

```javascript
win.loadURL(`http://localhost:3000`); 
```

修改为:

```javascript
win.loadURl(`file://${__dirname}/build/index.html`);
```

然後於main资料夹底下执行：

```
npm run build
```

若你没有修改任何参数，打包好的档案会位於main/build下
