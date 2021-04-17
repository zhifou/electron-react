import React, { useState, useEffect } from 'react';
import './index.less';

const About = (props) => {
    const [count, setCount] = useState(0);
    
    useEffect(() => {
        console.log('我是about');
    }, []);

    return (
        <div className="about">
            我是关于zhifou
            <button onClick={() => {
                setCount(count + 1);
            }}>点我试试</button>
            <span>{count}</span>
        </div>
    )
}

export default About;