import React from 'react'
import { Input, Button, message } from 'antd';
import { Form } from '@ant-design/compatible';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import './login.less'
import logo from '../../assets/images/logo.png'
import '@ant-design/compatible/assets/index.css';
import {reqLogin} from '../../api'
//const Item = Form.Item; 
//Login in component
class NormalLoginForm extends React.Component {

    handleSubmit = (event) => {
        // Default behavior for blocking events
        event.preventDefault();
        // Check all form fields
        this.props.form.validateFields(async (error, values) => {
            if(!error) {
                //success
                //console.log(values)
                const {username, password} = values
                const result = await reqLogin(username, password)
                if(result.status===0){
                    //show login message
                    message.success("Login Successfully")
                    const user = result.data
                    // memoryUtils.user = user //save in memory
                    // storageUtils.saveUser(user) //save in localstorage
                    //jump to home -> push() or replace()
                    this.props.history.replace('/')
                } else {
                    message.error(result.msg)
                }
            } else {
                console.log(error)
            }
        });
    }

    /* 
    Legality requirements for username/password
    1). Must enter
    2). Must be greater than or equal to 4 digits
    3). Must be less than or equal to 12 bits
    4). Must be composed of English, numbers or underscores
    */
    //Customize password verification
    valiodatorPWD = (rule, value, callback) => {
        // console.log(rule, value)
        const length = value && value.length
        const pwdReg = /^[a-zA-Z0-9_]+$/
        if (!value) {
        /* 
        callback If the parameter is not passed, 
        the verification is successful, 
        if the parameter is passed, the verification fails, 
        and an error will be prompted
        */
            callback('Must Enter')
        } else if (length < 4) {
            callback('Must be greater than or equal to 4 digits')
        } else if (length > 12) {
            callback('Must be less than or equal to 12 bits')
        } else if (!pwdReg.test(value)) {
            callback('Must be composed of English, numbers or underscores')
        } else {
            callback() // must call callback, means no problem
        }
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="login">
                <header className="login-header">
                    <img src={logo} alt="logo" />
                    <h1>I Owe You System -- Hayden</h1>
                </header>
                <section className="login-content">
                    <h2>User Sign in</h2>
                    <div>
                        <Form
                            name="normal_login"
                            className="login-form"
                            initialValues={{ remember: true }}
                            onSubmit={this.handleSubmit}
                        >
                            <Form.Item>
                            {getFieldDecorator('username', {
                                    rules: [
                                        {
                                            validator: this.valiodatorPWD
                                        }
                                    ],
                                })(
                                <Input 
                                    prefix={<UserOutlined className="site-form-item-icon" />} 
                                    type="user" 
                                    placeholder="Username" 
                                    className="login-form-input" />,
                                )}
                            </Form.Item>
                            <Form.Item>
                            {getFieldDecorator('password', {
                                    rules: [
                                        {
                                            validator: this.valiodatorPWD
                                        }
                                    ],
                                })(
                                <Input
                                    prefix={<LockOutlined className="site-form-item-icon" />}
                                    type="password"
                                    placeholder="Password"
                                    className="login-form-input"
                                />,
                                )} 
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit" className="login-form-button">
                                    Log in
        </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </section>
            </div>
        )
    }
}
const WrapLogin = Form.create()(NormalLoginForm)
export default WrapLogin