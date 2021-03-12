import React, { Component } from 'react';
import { remote, ipcRenderer } from 'electron';
import './index.scss';
import { Button, message } from 'antd';

const { Notification } = remote;

interface IProps {

}
interface IState {
  info: string;
}

class Home extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      info: ''
    };
  }
  componentDidMount() {
    // 监听主进程发来的事件
    ipcRenderer.on('fromMainProcess', (event: any, data: any) => {
      console.log('接收到main进程发送的消息11', data); // 我是主进程返回的值
      this.setState({
        info: JSON.stringify(data)
      });
    })
  }

  componentWillUnmount() {
    ipcRenderer.removeAllListeners('fromMainProcess');
  }

  onShowNotification = () => {
    let myNotification = new Notification({ title: '渲染进程通知', body: '在渲染进程中直接使用主进程的模块11' });
    myNotification.show();
  }

  onSendMessageToMain = () => {
    // 发送事件给主进程
    ipcRenderer.send('something', '传输给主进程的值')
  }

  onShowInfo = () => {
    message.success(this.state.info);
  }

  render() {
    return (
      <React.Fragment>
        <button onClick={this.onSendMessageToMain}>与主进程通信</button>
        <br /> <br />
        <button onClick={this.onShowNotification}>使用 remote 直接调用主进程模块</button>
        <Button type="primary" onClick={this.onShowInfo}>我是button</Button>
      </React.Fragment>
    )
  }
}

export default Home;