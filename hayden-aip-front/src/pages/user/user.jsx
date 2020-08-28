import React, {Component} from 'react'
import { reqUsers, reqDeleteUser, reqAddOrUpdateUser } from '../../api'
import UserForm from './user-form'
import './user.less'
import { Card, Button, Table, Modal, message } from 'antd'
import { formateDate } from '../../utils/dateUtils'
import LinkButton from '../../components/link-button'

let rolesNameArr = []
/*
User Router
*/
export default class User extends Component {
    state = {
        users:[],
        roles:[],
        isShow: false,
    }

    initColumns = () => {
        this.columns = [
            {
                title: "UserName",
                dataIndex: 'username'
            },
            {
                title: "Email",
                dataIndex: 'email'
            },
            {
                title: "Phone",
                dataIndex: 'phone'
            },
            {
                title: "Register Time",
                dataIndex: 'create_time',
                render: formateDate
            },
            {
                title: "Role",
                dataIndex: 'role_id',
                //render: (role_id) => this.state.roles.find(role => role._id===role_id).name
                //render: (role_id) => this.state.roles.find(role => true).name
                render: (role_id) => this.rolesNames[role_id]
            },
            {
                title: "Options",
                render: (user) => (
                    <span>
                        <LinkButton onClick={() => this.showUpdate(user)}>Fix User</LinkButton>
                        <LinkButton onClick={() => this.deleteUser(user)}>Delete User</LinkButton>
                    </span>
                )
            },
            
        ]
    }
    //Arrcording to role arr, generate all roles
    initRoleNames = (roles) => {
        const roleNames = roles.reduce((pre, role) => {
            pre[role._id] = role.name
            return pre
        }, {})
        this.rolesNames = roleNames
        //console.log(this.rolesNames)
        for (let key in roleNames) {
            //console.log(roleNames[key])
            rolesNameArr.push(roleNames[key])
        }
    }
    showAdd = () => {
        this.user = null //clear info
        this.setState({isShow: true})
    }
    showUpdate = (user) => {
        this.user = user // save user
        this.setState({
            isShow: true
        })
    }
    deleteUser = (user) => {
        Modal.confirm({
            title: `Are you Sure to Delete${user.username}?`,
            content: 'This operation cannot be undone!',
            onOk: async() => {
                const result = await reqDeleteUser(user._id)
                if (result.status===0) {
                    message.success('Delete User Successfully!')
                    this.getUsers()
                }
            },
            onCancel() { 
                console.log('Cancel')
            },
        })
    }
    addOrUpdateUser = async () => {
        this.setState({isShow: false})
        //1. get info
        const user = this.form.getFieldsValue()
        this.form.resetFields()
        //If it is an update, you need to specify the _id attribute for the user
        if (this.user) {
            user._id = this.user._id
        }
        //2.submit update request
        const result = await reqAddOrUpdateUser(user)
        //3.update
        if(result.status===0) {
            message.success(`${this.user ? 'Fix' : 'Add'}User Successfully!`)
            this.getUsers()
        }
    }
    getUsers = async () => {
        const result = await reqUsers()
        if (result.status === 0) {
            const { users, roles } = result.data
            this.initRoleNames(roles)
            this.setState({
                users, roles
            })
        }
    }
    handleCancel = () => {
        this.form.resetFields()
        this.setState({ isShow: false })
    }
    UNSAFE_componentWillMount() {
        this.initColumns()
    }
    componentDidMount() {
        this.getUsers()
    }

    render() {
        const { users, roles, isShow } = this.state
        const user = this.user
        const title = <Button 
        type="primary"
        onClick={this.showAdd}
        >Create New User</Button>
        return (
            <Card title={title}>
                <Table
                    bordered
                    rowKey='_id'
                    dataSource={users}
                    columns={this.columns}
                    //loading={loading}
                    pagination={{
                        defaultPageSize: 5,
                        showQuickJumper: true
                    }}
                />
                <Modal
                    title={user ? 'Fix User' : 'Add User'}
                    visible={isShow}
                    onOk={this.addOrUpdateUser}
                    onCancel={this.handleCancel}
                >
                    <UserForm
                        setForm={form => this.form = form}
                        roles={roles}
                        user={user}
                    >
                    </UserForm>
                </Modal>
            </Card>
        )
    }
}