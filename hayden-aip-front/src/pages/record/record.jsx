import React, {Component} from 'react'
import {Switch, Route, Redirect} from 'react-router-dom'
import './record.less'
import RecordHome from './home'
import RecordAddUpdate from './add-update'
import RecordDetail from './detail'
export default class Record extends Component {
    
    render() {
        return (
            <Switch>
                <Route path='/record' component={RecordHome} exact/>
                <Route path='/record/addupdate' component={RecordAddUpdate} />
                <Route path='/record/detail' component ={RecordDetail} />
                <Redirect to ='/record'/>
            </Switch>
        )
    }
}