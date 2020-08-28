import React, { Component } from 'react'
import { withRouter, Link } from 'react-router-dom'
import logo from '../../assets/images/logo.png'
import './index.less'
import { Menu } from 'antd'
import menuList from '../../config/menuConfig'
import { Icon } from '@ant-design/compatible';
import memoryUtils from '../../utils/memoryUtils';
const { SubMenu } = Menu;
/*
Bar Charts路由
*/
class LeftNav extends Component {

  //Determine whether the currently logged-in user has permission to the item
  hasAuth = (item) => {
    const {key, isPublic} = item

    const menus = memoryUtils.user.role.menus
    const username = memoryUtils.user.username
    /* 
      1. If the current user is admin
      2. If the current item is public, return true directly
      3. The current user's permission for this item: is the key in this item
    */
   if (username==="admin" || isPublic || menus.indexOf(key)!==-1) {
     return true
   } else if (item.children) {
     //4.If the current user has the sub-item permission of this item, if found is true, force conversion to bool
     return !!item.children.find(child => menus.indexOf(child.key)!==-1)
   }
   return false 
  }

    getMenuNodes = (menuList) => {
        const path = this.props.location.pathname
        return menuList.reduce((pre, item) => {
        /* 
        If the current user has the permission corresponding to the item, 
        the corresponding menu item needs to be displayed 
        */
          if (this.hasAuth(item)) {
            if (!item.children) {
                console.log(typeof(item.icon))
                pre.push((
                  <Menu.Item key={item.key}>
                    <Link to={item.key}>
                        <Icon type={item.icon} />
                      <span>{item.title}</span>
                    </Link>
                  </Menu.Item>
                ))
              } else {
                const cItem = item.children.find(cItem => cItem.key === path)
                //open the children item
                if (cItem) {
                  this.openKey = item.key
                }

                pre.push((
                    
                    <SubMenu
                      key={item.key}
                      title={
                        <span>
                          <Icon type={item.icon} />
                          <span>{item.title}</span>
                        </span>
                      }
                    >
                      {this.getMenuNodes(item.children)}
                    </SubMenu>
                  ))
              }
            } 
              return pre
    }, [])
        
    
    }

    /*
     Execute once before the first render() 
    to prepare data for the first render()
     */
    UNSAFE_componentWillMount() {
        this.menuNodes = this.getMenuNodes(menuList)
    }

    render() {
        let path = this.props.location.pathname
        console.log('This path is: ', path)
        const openKey = this.openKey
        return (
            <div className="left-nav">
                <Link to='/' className="left-nav-header">
                    <img src={logo} alt="logo" />
                    <h1>Hayden's aip</h1>
                </Link>
                <div style={{ width: 200 }}>
                    <Menu
                        mode="inline"
                        theme="dark"
                        selectedKeys={[path]}
                        defaultOpenKeys={[openKey]}
                    >
                        {this.menuNodes}
                </Menu>
                </div>
            </div>
        )
    }
}
// this.props is empty, 
//unable to execute the history and location in props
export default withRouter(LeftNav)