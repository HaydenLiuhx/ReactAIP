import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import {
    Select,
    Input
} from 'antd'
import { Form } from '@ant-design/compatible'
const Option = Select.Option
const Item = Form.Item
/*
    Add users and modify user form components
*/
class UserForm extends PureComponent {

    static propTypes = {
        setForm: PropTypes.func.isRequired, //Functions used to pass form objects
        roles: PropTypes.array.isRequired, // pass roles
        user: PropTypes.object //maybe undefined
    }

    componentWillMount() {
        this.props.setForm(this.props.form)
    }

    render() {
        const {roles} = this.props
        const user = this.props.user || {} 
        const { getFieldDecorator } = this.props.form
        const formItemLayout = {
            labelCol: { span: 4 }, //Left
            wrapperCol: { span: 12 }, //Right Width
        };
        return (
            <Form {...formItemLayout}>
                <Item label='Username' >
                    {getFieldDecorator('username', {
                        initialValue: user.username,
                    })(
                        <Input placeholder='Input Your UserName Please!' />
                    )}
                </Item>
                {
                    user._id ? null : (
                        <Item label='Password'>
                    {getFieldDecorator('password', {
                        initialValue: user.password,
                    })(
                        <Input type="password" placeholder='Input Your Password Please!' />
                    )}
                </Item>
                    )
                }
                <Item label='Phone No.'>
                    {getFieldDecorator('phone', {
                        initialValue: user.phone,
                    })(
                        <Input placeholder='Input Your Phone No. Please!' />
                    )}
                </Item>
                <Item label='Email'>
                    {getFieldDecorator('email', {
                        initialValue: user.email,
                    })(
                        <Input placeholder='Input Your Email Address Please!' />
                    )}
                </Item>
                <Item label='Role'>
                    {getFieldDecorator('role_id', {
                        initialValue: user.role_id,
                    })(
                        <Select>
                            {
                                roles.map(
                                    role => <Option key={role._id} value={role._id}>{role.name}</Option>)
                            }
                        </Select>
                    )}
                </Item>
            </Form>
        )
    }
}

export default Form.create()(UserForm)