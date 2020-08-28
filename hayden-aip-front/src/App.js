/*
Application root component

This class inherits the component provided by react, export default App;
It is to make the App public so that index.js can reference it. If App.js inherits component, it must be rendered using render.
The content of return is similar to the content of the html structure, which is jsx. The jsx syntax is the main syntax of react.
*/
import React from 'react';
import { Component } from "react";
//import { message, Button, Space } from 'antd';
import {BrowserRouter, Route, Switch} from 'react-router-dom'
import Login from './pages/login/login'
import Admin from './pages/admin/admin'

export default class App extends Component {

    render() {
        //Nested tags,'/' is reduced by one level
        return (
            <BrowserRouter>
            {/* Match only one of them */}
            <Switch>   
            <Route path='/login' component={Login}></Route>
            <Route path='/' component={Admin}></Route>
            </Switch>
            </BrowserRouter>

        )
    }
}
