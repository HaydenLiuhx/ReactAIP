import React, { Component } from 'react'
import memoryUtils from '../../utils/memoryUtils'
import { Redirect, Switch, Route } from 'react-router-dom'
import { Layout } from 'antd'
import LeftNav from '../../components/left-nav'
import Header from '../../components/header'
import Footer from '../../components/footer'
import Home from '../home/home'
import Record from '../record/record'
import Request from '../request/request'
import Role from '../role/role'
import User from '../user/user'
import Bar from '../charts/bar'
import Line from '../charts/line'
import Pie from '../charts/pie'
const { Sider, Content } = Layout;
//admin router component

export default class Admin extends Component {
    render() {
        const user = memoryUtils.user
        //if memory doesn't store user -> means not login
        if (!user || !user._id) {
            return <Redirect to='/login' />
        }
        return (
            <div style={{ height: '100%'}}>
                <Layout style={{ minHeight: '100%' }}>
                    <Sider>
                        <LeftNav />
                    </Sider>
                    <Layout>
                        <Header>Header</Header>
                        <Content style={{ margin: 20, backgroundColor: '#fff' }}>
                            <Switch>
                                <Route path='/home' component={Home} />

                                <Route path='/record' component={Record} />

                                <Route path='/request' component={Request} />

                                <Route path='/role' component={Role} />

                                <Route path='/user' component={User} />

                                <Route path='/charts/bar' component={Bar} />

                                <Route path='/charts/line' component={Line} />

                                <Route path='/charts/pie' component={Pie} />

                                <Redirect to='/home' />
                            </Switch>
                        </Content>
                        <Footer />
                    </Layout>
                </Layout>
            </div>
        )
    }
}