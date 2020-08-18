const { app, BrowserWindow, ipcMain, Notification } = require('electron')
const electron = require('electron');
const path = require('path');
//用一个 Tray 来表示一个图标,这个图标处于正在运行的系统的通知区 ，通常被添加到一个 context menu 上.
const Menu = electron.Menu;
const Tray = electron.Tray;
//托盘对象
let appTray = null;

const isDev = process.env.NODE_ENV === 'development';

let win = null;
function createWindow() {
    // 创建浏览器窗口
    win = new BrowserWindow({
        show: true,
        width: 890,
        height: 556,
        webgl: true,
        frame: true,
        transparent: false,
        webPreferences: {
            webSecurity: true,
            allowRunningInsecureContent: false,
            nativeWindowOpen: false,
            nodeIntegration: true
        },
        backgroundColor: '#efefef',
        // icon: path.join(__dirname, 'assets/images/app.png')
    });

    // if (process.platform === 'darwin') {
    //    app.dock.setIcon(path.join(__dirname, 'assets/images/app.png'));
    // }

    if (isDev) {
        win.loadURL(`http://localhost:3000`);
    } else {
        win.loadFile(path.resolve(__dirname, './dist/index.html'));
    }
    win.center();

    // 打开开发者工具，默认不打开
    win.webContents.openDevTools();

    //系统托盘右键菜单
    let trayMenuTemplate = [
        {
            label: '设置',
            click: function () { } //打开相应页面
        },
        {
            label: '帮助',
            click: function () { }
        },
        {
            label: '关于',
            click: function () { }
        },
        {
            label: '退出',
            click: function () {
                app.quit();
                app.quit();//因为程序设定关闭为最小化，所以调用两次关闭，防止最大化时一次不能关闭的情况
            }
        }
    ];

    // //系统托盘图标目录
    // let trayIcon = path.join(__dirname, 'assets/images');//app是选取的目录

    // appTray = new Tray(path.join(trayIcon, 'app.ico'));//app.ico是app目录下的ico文件

    // //图标的上下文菜单
    // const contextMenu = Menu.buildFromTemplate(trayMenuTemplate);

    // //设置此托盘图标的悬停提示内容
    // appTray.setToolTip('我的托盘图标');

    // //设置此图标的上下文菜单
    // appTray.setContextMenu(contextMenu);

    // //单击右下角小图标显示应用
    // appTray.on('click', function () {
    //     win.show();
    // })

    win.on('close', (e) => {
        //回收BrowserWindow对象
        if (win.isMinimized()) {
            win = null;
        } else {
            e.preventDefault();
            win.minimize();
        }
    });
    // win.on('resize', () => {
    //     win.reload();
    // })
}

// 监听渲染程序发来的事件
ipcMain.on('something', (event, data) => {
    console.log('接收到render进程发送的消息', data);
    let myNotification = new Notification({ title: '主进程通知', body: '接收到render进程发送的消息' });
    myNotification.show();
    event.sender.send('something1', '我是主进程返回的值')
})


app.on('ready', createWindow);
app.on('window-all-closed', () => {
    app.quit();
});

app.on('activate', () => {
    if (win == null) {
        createWindow();
    }
}) 