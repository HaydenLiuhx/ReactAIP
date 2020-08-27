import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { reqWeather } from '../../api'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
import menuList from '../../config/menuConfig'
import { formateDate } from '../../utils/dateUtils'
import LinkButton from '../link-button'
import './index.less'
import { Modal } from 'antd'
/*
Header Router
*/
class Header extends Component {

    state = {
        currentTime: formateDate(Date.now()),
        weatherIcon: '',
        weather: ''
    }
    logout = () => {
        //show modal
        Modal.confirm({
            title: 'Do you want to Login Out?',
            content: 'This action CANNOT be undone!',
            onOk: () => {
              console.log('OK',this);
              //delete user's data
              storageUtils.removeUser();
              memoryUtils.user = {}
              this.props.history.replace('/login')
            },
            onCancel() {
              console.log('Cancel');
            }
            
          });
        }
    getTime = () => {
        this.intervalId = setInterval(
            () => {
                const currentTime = formateDate(Date.now())
                this.setState({currentTime:currentTime})
            },1000
        )
    }
    getTitle = () => {
        const path = this.props.location.pathname
        let title
        menuList.forEach(item => {
            if(item.key===path) {
                title = item.title
            }
            else if (item.children) {
                const cItem = item.children.find(
                    cItem => path.indexOf(cItem.key) === 0
                    )
                if(cItem) {
                    title = cItem.title
                }
            }
        })
        return title
    }
    getWeather = async() => {
        const {
            weatherIcon, 
            weather, 
            temperature
        } = await reqWeather('Sydney')
        this.setState({weatherIcon, weather, temperature})
    }
    componentDidMount () {
        this.getTime()
        this.getWeather()
        //this._isMounted = false;
    }
    componentWillUnmount () {
        clearInterval(this.intervalId)
    }
    render() {
        const username = memoryUtils.user.username
        const title = this.getTitle()
        const {
            currentTime, 
            weatherIcon, 
            weather, 
            temperature
        } = this.state
        return (
            <div className="header">
                <div className="header-left">
                    <span>{currentTime}</span>
                    <img src={weatherIcon} alt=""></img>
                    <span>{weather}</span>
                    <span className="temp">{temperature}°C</span>
                </div>
                <div className="header-title">{title}</div>
                <div className="header-right">
                    <span>Welcome, {username} </span>
                    <LinkButton onClick={this.logout}> Log out</LinkButton>
                </div>
            </div>
        )
    }
}
// this.props is empty, 
//unable to execute the history and location in props
export default withRouter(Header)