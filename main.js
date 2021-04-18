const { app, BrowserWindow, ipcMain, Notification, Menu } = require('electron')
const electron = require('electron');
const path = require('path');
//用一个 Tray 来表示一个图标,这个图标处于正在运行的系统的通知区 ，通常被添加到一个 context menu 上.
// const Menu = electron.Menu;
const Tray = electron.Tray;
const globalShortcut = electron.globalShortcut;

//托盘对象
let appTray = null;

const isDev = process.env.NODE_ENV === 'development';

let win = null;
function createWindow() {
    // 创建浏览器窗口
    win = new BrowserWindow({
        show: true,
        width: 890,
        height: 600,
        webgl: true,
        frame: true,
        transparent: false,
        // titleBarStyle: 'hiddenInset',
        webPreferences: {
            webSecurity: true,
            allowRunningInsecureContent: false,
            nativeWindowOpen: false,
            nodeIntegration: true,

            contextIsolation: false,
            worldSafeExecuteJavaScript: false,
            nodeIntegrationInWorker: true,
            webviewTag: true, // 解决webview无法显示问题
            enableRemoteModule: true
        },
        backgroundColor: '#efefef',
        // icon: path.join(__dirname, 'assets/app.png')
    });

    if (process.platform === 'darwin') {
        // app.dock.setIcon(path.join(__dirname, 'assets/app.png'));
    }

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

    // 系统托盘图标目录
    let trayIcon = path.join(__dirname, 'assets');//app是选取的目录

    appTray = new Tray(path.join(trayIcon, 'app.ico'));//app.ico是app目录下的ico文件

    // 图标的上下文菜单
    const contextMenu = Menu.buildFromTemplate(trayMenuTemplate);

    //设置此托盘图标的悬停提示内容
    appTray.setToolTip('我的托盘图标');

    // 设置此图标的上下文菜单
    appTray.setContextMenu(contextMenu);

    // 单击右下角小图标显示应用
    appTray.on('click', function () {
        win.show();
    });

    // 设置应用程序主菜单
    let template = [
        {
            label: '乐库',
            submenu: [
                {
                    label:'儿童大全',
                    click:() => {
                        let win = new BrowserWindow({
                            width:500,
                            height:500,
                            webPreferences: {
                                nodeIntegration: true
                            }
                        });
                        win.loadFile('main/children.html');
                        win.on('closed', ()=>{
                            win = null
                        })
                    }
                },
                {
                    type: 'separator'
                },
                {label:'抖音热歌'},
                {label:'车载音乐'},
                {label:'网红歌曲'}
            ]
        },
        {
            label: '电台',
            submenu: [
                {label:'主题'},
                {label:'场景'},
                {label:'心情'}
            ]
        }
    ]
    
    let m = Menu.buildFromTemplate(template);// 加载模板
    
    Menu.setApplicationMenu(m);     // 设置窗口的菜单

    win.on('close', (e) => {
        // 回收BrowserWindow对象
        if (win.isMinimized()) {
            win = null;
        } else {
            e.preventDefault();
            win.minimize();
        }
    });
    win.on('resize', () => {
        win.reload();
    });


    // 引入BrowserView在窗口中打开外部网页，类似iframe效果
    // let BrowserView = electron.BrowserView;
    // let view = new BrowserView();
    // win.setBrowserView(view);
    // view.setBounds({
    //     x: 0,
    //     y: 300,
    //     width: 500,
    //     height: 400
    // });
    // view.webContents.loadURL('https://www.baidu.com');

    // 注册全局快捷键
    globalShortcut.register('ctrl+b', () => {
        let win = new BrowserWindow({
            width:500,
            height:500,
            webPreferences: {
                nodeIntegration: true
            }
        });
        win.loadURL('http://www.zhifou.co/');
        win.on('closed', ()=>{
            win = null
        })
    });

    let isRegister= globalShortcut.isRegistered('ctrl+b') ? 'Register Success':'Register fail';
    console.log('------->'+isRegister);
}

/**
 * 监听最大化、最小化、关闭操作
 */
// ipcMain.on('min', e => {
//     win.minimize();
//     console.log('min');
// });
// ipcMain.on('max', e => {
//     console.log('max');
//     if (win.isMaximized() || win.isFullScreen()) {
//         win.unmaximize();
//     } else {
//         win.maximize();
//     }
// });

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
    if (win === null) {
        createWindow();
    }
});

app.on('will-quit', function() {
    //注销全局快捷键的监听
    globalShortcut.unregister('ctrl+b');
    globalShortcut.unregisterAll();
});