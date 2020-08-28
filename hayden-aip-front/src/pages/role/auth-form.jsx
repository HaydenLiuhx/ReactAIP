import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
    Form,
    Tree,
    Input
} from 'antd'
import menuList from '../../config/menuConfig'

const Item = Form.Item
const { TreeNode } = Tree;
/*
    add category auth component
*/
export default class AuthForm extends Component {

    //get selected role
    static propTypes = {
        role: PropTypes.object
    }

    constructor (props) {
        super(props)
        //Generate the initial state based on the menus of the incoming role
        const {menus} = this.props.role
        this.state = {
            checkedKeys: menus
        }
    }

    //Provide access to the latest menus data for the parent component
    getMenus = () => this.state.checkedKeys

    getTreeNodes = (menuList) => {
        return menuList.reduce((pre, item) => {
            pre.push(
                <TreeNode title={item.title} key={item.key}>
                    {item.children ? this.getTreeNodes(item.children) : null}
                </TreeNode>
            )
            return pre
        }, [])
    }

    //Callback when a Node is selected
    onCheck = checkedKeys => {
        console.log('onCheck', checkedKeys);
        this.setState({ checkedKeys });
      };
    

    UNSAFE_componentWillMount() {
        this.treeNodes = this.getTreeNodes(menuList)
    }

    //Update the checkedKeys status according to the newly passed role
    /* 
    Automatically called when the component receives a new attribute, 
    and executes it before the render
    */
    UNSAFE_componentWillReceiveProps(nextProps) {
        const menus = nextProps.role.menus
        //Will not enter the process of render()
        this.setState({
            checkedKeys:menus
        })
        //this.state.checkedKeys = menus
    }

    render() {
        const { role } = this.props
        const { checkedKeys } = this.state
        const formItemLayout = {
            labelCol: { span: 4 }, 
            wrapperCol: { span: 12 }, 
        };
        return (
            <Form>
                <Item label='Role Name' {...formItemLayout}>
                    <Input value={role.name} disabled />
                </Item>

                <Tree 
                checkable
                defaultExpandAll={true}
                checkedKeys={checkedKeys}
                onCheck={this.onCheck}
                >
                    <TreeNode title={<span style={{ color: '#34B085' }}>Platform Permissions</span>} key="all">
                        {this.treeNodes}
                    </TreeNode>
                </Tree>
            </Form>
        )
    }
}

