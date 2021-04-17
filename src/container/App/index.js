import React, { Component, MouseEvent } from "react";
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import history from '../../routes/history';
import Home from "../Home";
import About from "../About";

import "./index.less";
import logo from "@assets/images/logo.svg";

const App = () => {
    const gotoNext = (url, e) => {
      e.preventDefault();
      
      history.push(url);
      console.log(url, history);
      // window.location=url;
    };

    return (
      <Router>
            <div className="wrapper">
              <header>
                  <div className="header">
                    <div className="nav">
                      <div className="logo"><img src={logo} alt="logo"/></div>
                      <a href="/">首页</a>
                      <a href="/about" onClick={(e) => gotoNext('/about', e)}>关于我们</a>
                    </div>
                    <div className="nav-action">
                      action
                    </div>
                  </div>
              </header>
              <div className="container">
              <Switch>
                  <Route exact path="/" component={Home} />
                  <Route exact path="/about" component={About} />
              </Switch>
              </div>
              <footer>
                I am footer.
              </footer>
            </div>
            </Router>
    );
};

export default App;
