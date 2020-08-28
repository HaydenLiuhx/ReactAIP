import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
    Form,
    //Select,
    Input
} from 'antd'

const Item = Form.Item
/*
    add class component
*/
class AddForm extends Component {

    static propTypes = {
        setForm: PropTypes.func.isRequired, //Functions used to pass form objects
    }

    componentWillMount() {
        this.props.setForm(this.props.form)
    }

    render() {
        const { getFieldDecorator } = this.props.form
        const formItemLayout = {
            labelCol: { span: 4 }, 
            wrapperCol: { span: 12 }, 
        };
        return (
            <Form>
                <Item label='Role Name' {...formItemLayout}>
                    {getFieldDecorator('roleName', {
                        initialValue: '',
                        rules: [{required: true, message: 'Must Input Role Name!'}],
                    })(
                        <Input placeholder='Please Input Role Name!' />
                    )}

                </Item>
            </Form>
        )
    }
}

export default Form.create()(AddForm)