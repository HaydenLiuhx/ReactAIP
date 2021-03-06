import React, {Component} from 'react'
import './role.less'
import AddForm from './add-form'
import AuthForm from './auth-form'
import memoryUtils from '../../utils/memoryUtils'
import { formateDate } from '../../utils/dateUtils'
import storageUtils from '../../utils/storageUtils'
import { Card, Button, Table, Modal, message } from 'antd'
import { PAGE_SIZE } from '../../utils/constants'
import { reqRoles, reqAddRole, reqUpdateRole } from '../../api'
/*
Home Router
*/
export default class Role extends Component {
    state = {
        roles: [], //role list
        role: {}, //selected role
        isShowAdd: false, 
        isShowAuth: false, //Whether to display the permission setting interface
    }
    constructor (props) {
        super(props)
        this.auth = React.createRef()
    }
    initColumn = () => {
        this.columns = [
            {
                title: 'Role Name',
                dataIndex: 'name'
            },
            {
                title: 'Create Time',
                dataIndex: 'create_time',
                render: (create_time) => formateDate(create_time)
            },
            {
                title: 'Authorization time',
                dataIndex: 'auth_time',
                render: formateDate
            },
            {
                title: 'Authorizer',
                dataIndex: 'auth_name'
            },
        ]
    }
    getRoles = async () => {
        const result = await reqRoles()
        if (result.status === 0) {
            const roles = result.data
            this.setState({
                roles: roles
            })
        }
    }

    onRow = (role) => {
        return {
            onClick: event => { //click row
                console.log('row onClick', role)
                this.setState({
                    role: role
                })
            },
        }
    }
    addRole = () => {
        this.form.validateFields( async(error, values) => {
            if (!error) {
                //hide confirmation box
                this.setState({
                    isShowAdd: false
                })
                //Collect data -> send request -> 
                //have results -> respond, process, update
                const {roleName} = values
                this.form.resetFields()//clear input box
                const result = await reqAddRole(roleName)
                if (result.status===0) {
                    message.success('Update Role Successfully')
                    //this.getRoles() //Change another way
                    //new role
                    const role = result.data
                    //update role status
                    /* const roles = this.state.roles //1. not good enough
                    roles.push(role)
                    //Delete
                    //roles.splice()
                    this.setState({
                        roles:roles
                    }) */
                    //2. Generate a copy first, then update it with setState
                    //const roles = [...this.state.roles] 
                    //3, Update roles status, update/modify based on original status data
                    this.setState((state, props) => ({
                        roles: [...this.state.roles, role]
                    }))
                } else {
                    message.error('Add Role Failed')
                }   
            }
        })
    }
    updateRole = async () => {
        //Hide confirmation box
        this.setState({
            isShowAuth: false
        })
        const role = this.state.role 
        //get the newest menus
        const menus = this.auth.current.getMenus()
        role.menus = menus
        role.auth_time = Date.now()
        role.auth_name = memoryUtils.user.username
        //request for updating
        const result = await reqUpdateRole(role)
        if (result.status===0) {
            
            //this.getRoles() //update list
            /*
             If the current update is your own permissions, 
                log in again
             */
            if (role._id===memoryUtils.user.role_id) {
                memoryUtils.user = {}
                storageUtils.removeUser()
                this.props.history.replace('/login')
                message.success(
                    "The current user role permissions are successfully modified, please log in again"
                    )
            } else {
                message.success("Role permissions set successfully")
                this.setState({
                    roles: [...this.state.roles]
                })
            }
        }
    }
    handleCancelAdd = () => {
        this.setState({
            isShowAdd: false
        })
        this.form.resetFields()//清空输入框
    }

    handleCancelAuth = () => {
        this.setState({
            isShowAuth: false
        })
    }

    UNSAFE_componentWillMount() {
        this.initColumn()
    }

    componentDidMount() {
        this.getRoles()
    }
    render() {
        const { roles, role, isShowAdd, isShowAuth } = this.state
        const title = (
            <span>
                <Button
                    type="primary" 
                    onClick={() => this.setState({isShowAdd:true})}
                    >
                        Create role
                </Button>
                <Button 
                    type="primary" 
                    disabled={!role._id} 
                    style={{ marginLeft: 15 }}
                    onClick={() => this.setState({isShowAuth:true})}
                    >
                        Set role permissions
                </Button>
            </span>
        )
        return (
           <Card title={title}>
               <Table
                    bordered
                    rowKey='_id'
                    dataSource={roles}
                    columns={this.columns}
                    //loading={loading}
                    rowSelection={{ 
                        type: 'radio', 
                        selectedRowKeys: [role._id],
                        onSelect: (role) => { //radio
                            this.setState({
                                role: role
                            })
                        }
                    }}
                    onRow={this.onRow}
                    pagination={{
                        defaultPageSize: PAGE_SIZE,
                        showQuickJumper: true
                    }}
               />
               <Modal
                    title="Add New Role"
                    visible={isShowAdd}
                    onOk={this.addRole}
                    onCancel={this.handleCancelAdd}
                >
                   <AddForm
                        setForm={(form) => this.form = form}
                    >
                    </AddForm>
               </Modal>
               <Modal
                    title="Set role permissions"
                    visible={isShowAuth}
                    onOk={this.updateRole}
                    onCancel={this.handleCancelAuth}
               >
                   <AuthForm role={role} ref={this.auth}/>
               </Modal>
           </Card>
        )
    }
}