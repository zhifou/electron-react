import React, { Component } from "react";

import { BrowserRouter as Router, Route, NavLink } from "react-router-dom";
import "./index.scss";
import logo from "@assets/images/logo.svg";

import Home from "../Home";
import About from "../About";

const App = () => {
    return (
        <Router>
            <div className="wrapper">
              <header>
                  <div className="header">
                    <div className="nav">
                      <div className="logo"><img src={logo} alt="logo"/></div>
                      <NavLink className="nav__link" to="/">首页</NavLink>
                      <NavLink className="nav__link" to="/about">关于我们</NavLink>
                    </div>
                    <div className="nav-action">
                      action
                    </div>
                  </div>

              </header>
              <div className="container">
                  <Route exact path="/" component={Home} />
                  <Route path="/about" component={About} />
              </div>
              <footer>
                I am footer.
              </footer>
            </div>

        </Router>
    );
};

export default App;
