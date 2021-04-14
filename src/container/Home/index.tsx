import React, { Component } from "react";
import { remote, ipcRenderer, clipboard, shell } from "electron";
import "./index.scss";
import { Button, message } from "antd";
import { EventHandler } from "react";

const { Notification, BrowserWindow } = remote;

interface IProps {}
interface IState {
    info: string;
}

class Home extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            info: "",
        };
    }
    componentDidMount() {
        // 监听主进程发来的事件
        ipcRenderer.on("fromMainProcess", (event: any, data: any) => {
            console.log("接收到main进程发送的消息11", data); // 我是主进程返回的值
            this.setState({
                info: JSON.stringify(data),
            });
        });

        // 设置应用程序右键菜单
        let rightTemplate = [
            {
                label: "剪切",
                accelerator: "ctrl+x",
            },
            {
                label: "复制",
                accelerator: "ctrl+c",
            },
            {
                label: "粘贴",
                accelerator: "ctrl+v",
            },
            {
                label: "新建",
                accelerator: "ctrl+n",
                click: () => {
                    let win = new BrowserWindow({
                        width: 500,
                        height: 500,
                        webPreferences: {
                            nodeIntegration: true,
                        },
                    });
                    win.loadFile("main/children.html");
                    win.on("closed", () => {
                        win = null;
                    });
                },
            },
        ];

        let mContext = remote.Menu.buildFromTemplate(rightTemplate);
        window.addEventListener("contextmenu", function (e) {
            // alert('码云笔记')
            e.preventDefault();
            mContext.popup({ window: remote.getCurrentWindow() });
        });
    }

    componentWillUnmount() {
        ipcRenderer.removeAllListeners("fromMainProcess");
    }

    onShowNotification = () => {
        let myNotification = new Notification({
            title: "渲染进程通知",
            body: "在渲染进程中直接使用主进程的模块11",
        });
        myNotification.show();
    };

    onSendMessageToMain = () => {
        // 发送事件给主进程
        ipcRenderer.send("something", "传输给主进程的值");
    };

    onShowInfo = () => {
        message.success(this.state.info);
    };

    onCopyClick = () => {
        const code = (document as Document).querySelector("#code");
        clipboard.writeText(code.innerHTML);
        message.info("复制成功");
    };

    onOpenNewWindow = () => {
        let newWin = new BrowserWindow({
            width: 500,
            height: 500,
        });

        newWin.loadFile("main/yellow.html");
        newWin.on("closed", () => {
            newWin = null;
        });
    };

    // 在浏览器中打开页面
    openInBrowser = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        console.log(e.target);
        let href = (e.target as HTMLAnchorElement).href;
        shell.openExternal(href);
    };

    onOpenSubWindow = () => {
        window.open('https://www.baidu.com');
    };

    onSendMsg = () => {
        let option = {
            title: '来自海上的消息',
            body: '欢迎来上海做客，阿拉上海欢迎你。'
        }
        new window.Notification(option.title, option);
    };

    render() {
        return (
            <React.Fragment>
                <div>
                    <button onClick={this.onSendMessageToMain}>
                        与主进程通信
                    </button>
                </div>
                <div>
                    <button onClick={this.onShowNotification}>
                        使用 remote 直接调用主进程模块
                    </button>
                </div>
                <div>
                    <Button type="primary" onClick={this.onShowInfo}>
                        我是button
                    </Button>
                </div>
                <div>
                    激活码: <span id="code">mybj123com1234567</span>
                    <Button type="primary" onClick={this.onCopyClick}>
                        复制激活码
                    </Button>
                </div>
                <Button type="primary" onClick={this.onOpenNewWindow}>
                    打开一个新窗口
                </Button>
                {/** 如何在浏览器中打开链接 */}
                <div>
                    <a
                        onClick={this.openInBrowser}
                        href="https://www.baidu.com"
                    >
                        在浏览器中打开百度
                    </a>
                </div>
                <div>
                    <Button type="primary" onClick={this.onOpenSubWindow}>
                        打开一个子窗口
                    </Button>
                </div>
                <div>
                    <Button type="primary" onClick={this.onSendMsg}>
                        发送一个消息
                    </Button>
                </div>
            </React.Fragment>
        );
    }
}

export default Home;
