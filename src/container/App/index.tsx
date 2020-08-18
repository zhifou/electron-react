import React, { Component } from 'react';
import { remote, ipcRenderer } from 'electron';
import './index.scss';
import logo from '../../logo.svg';
import download from '../../download.png';
import { Button } from 'antd';

const { Notification } = remote;

class App extends Component {
  componentDidMount() {
    // 监听主进程发来的事件
    ipcRenderer.on('something1', (event: any, data: any) => {
      console.log('接收到main进程发送的消息11', data); // 我是主进程返回的值
    })
  }

  onShowNotification() {
    let myNotification = new Notification({ title: '渲染进程通知', body: '在渲染进程中直接使用主进程的模块11' });
    myNotification.show();
  }

  onSendMessageToMain() {
    // 发送事件给主进程
    ipcRenderer.send('something', '传输给主进程的值')
  }

  componentWillUnmount() {
    ipcRenderer.removeAllListeners('something1');
  }

  render() {
    return (
      <React.Fragment>
        <img src={logo} className="App-logo" alt="logo" />
        <button onClick={this.onSendMessageToMain}>与主进程通信-12</button>
        <br /> <br />
        <button onClick={this.onShowNotification}>使用 remote 直接调用主进程模块</button>
        <Button type="primary">我是button</Button>
      </React.Fragment>
    )
  }
}

export default App;