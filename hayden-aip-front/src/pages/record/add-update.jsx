import React, { Component } from 'react'
import { Card, Input, Button, message, Select } from 'antd'
import { Form } from '@ant-design/compatible'
import LinkButton from '../../components/link-button'
import PicturesWall from './pictures-wall'
import RichTextEditor from  './rich-text-editor'
import { reqAddOrUpdateRecord, reqUsers } from '../../api'
import { ArrowLeftOutlined } from '@ant-design/icons'
const { Item } = Form
const { TextArea } = Input;
const Option = Select.Option
/*
RecordAddUpdate
*/
class RecordAddUpdate extends Component {
    // static propTypes = {
    //     users: PropTypes.array.isRequired //可能为undefined
    // }
    state = {
        users: [],
        roles: []
    }
    /* 
        Create a container to store the label object identified by ref
        Child -> Parent 
    */
    constructor(props) {
        super(props)
        this.pw = React.createRef()
        this.editor = React.createRef()
    }
    getUsers = async () => {
        const result = await reqUsers()
        if (result.status === 0) {
            const { users, roles } = result.data
            this.setState({
                users, roles
            })
        }
    }
    submit = async() => {
        // Perform form validation. If passed, send the request
        this.props.form.validateFields(async (err, val) => {
            if (!err) {
                //1.Collect data and encapsulate it into a record object
                const {name,desc} = val
                const imgs = this.pw.current.getImgs()
                const detail = this.editor.current.getDetail()
                const record = {name,desc,imgs,detail}
                //If it is an update, you need to add _id
                if(this.isUpdate) {
                    record._id = this.record._id
                }
                //2.Ready to call the interface request function, add/update
                const result = await reqAddOrUpdateRecord(record)
                //3.Prompt according to the result
                if (result.status===0) {
                    message.success(`${this.isUpdate ? "Update" : "Add"} Record Successfully`)
                    this.props.history.goBack()
                } else {
                    message.error(`${this.isUpdate ? "Update" : "Add"} Record Unsuccessfully`)
                }
            }
        })
    }
    componentDidMount() {
        this.getUsers()
    }
    UNSAFE_componentWillMount() {
        const record = this.props.location.state
        //Force conversion of bool type, save the update flag
        this.isUpdate = !!record
        this.record = record || {}
        console.log(this.record)
    }   
    render() {
        const { users } = this.state
        const { isUpdate, record } = this
        const { imgs, detail } = record
        const formItemLayout = {
            labelCol: { span: 2 }, //left Label width
            wrapperCol: { span: 8 }, //right width
        }
        const title = (
            <span>
                <LinkButton onClick={() => this.props.history.goBack()}>
                <ArrowLeftOutlined style={{ fontSize: 20 }}/>
                    {/* <Icon type="arrow-left" ></Icon> */}
                </LinkButton>
                <span>{isUpdate ? 'Update Record' : 'Add Record'}</span>
            </span>
        )
        const { getFieldDecorator } = this.props.form
        return (
            <Card title={title}>
                <Form {...formItemLayout}>
                    <Item label='Creditor'>
                        {getFieldDecorator('creditor_username', {
                            initialValue: record.creditor_username,
                    })(
                        <Select>
                            {
                            users.map(
                                user => <Option key={user._id} value={user._id}>{user.username}</Option>)
                            }
                        </Select>
                    )}
                    </Item>
                    <Item label='Debtor'>
                    {getFieldDecorator('debtor_username', {
                        initialValue: record.debtor_username,
                    })(
                        <Select>
                            {
                            users.map(
                                user => <Option key={user._id} value={user._id}>{user.username}</Option>)
                            }
                        </Select>
                    )}
                    </Item>
                    <Item label="Record Name">
                    {
                            getFieldDecorator('name', {
                                initialValue: record.name,
                                rules: [
                                    { required: true, message: 'Must Input Record Name!' }
                                ]
                            })(<Input placeholder="Please Input Record Name"></Input>)
                        }
                    </Item>
                    <Item label="Record Description">
                        {
                            getFieldDecorator('desc', {
                                initialValue: record.desc,
                                rules: [
                                    { required: true, message: 'Must Input Record Description!' }
                                ]
                            })(<TextArea
                                placeholder="Please Input Record Description"
                                autoSize={{ minRows: 2, maxRows: 6 }} />)
                        }
                    </Item>
                    <Item label="Record Picture">
                        <PicturesWall ref={this.pw} imgs={imgs}/>
                    </Item>
                    <Item label="Record Detail" labelCol={{ span: 2 }} wrapperCol={{ span: 20 }}>
                        <RichTextEditor ref={this.editor} detail={detail}/>
                    </Item>
                    <Item >
                        <Button type='primary' onClick={this.submit}>Submit Record</Button>
                    </Item>
                </Form>
            </Card>
        )
    }
}
export default Form.create()(RecordAddUpdate)