import React, { useState } from 'react';
import './index.scss';
import { Button, message } from 'antd';

interface IProps {

}

const About: React.FC<IProps> = (props: IProps) => {
    const [count, setCount] = useState(0);

    return (
        <div className="about">
            我是关于zhifou
            <Button type="primary" onClick={() => {
                setCount(count + 1);
            }}>点我试试</Button>
            <span>{count}</span>
        </div>
    )
}

export default About;