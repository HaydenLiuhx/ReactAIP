import React, {Component} from 'react'
import './record.less'
import { Card, Select, Input, Button, Table, message } from 'antd'
import { PAGE_SIZE } from '../../utils/constants'
import LinkButton from '../../components/link-button'
import { reqSearchRecords, reqRecords, reqUpdateStatus } from '../../api'
import { PlusOutlined } from '@ant-design/icons'
const Option = Select.Option
/*
Home Router
*/
export default class RecordHome extends Component {
    state = {
        records:[],
        loading: false,
        searchName: '',
        searchType: 'recordName',
        total: 0,
    }
    initColumns = () => {
        this.columns = [
            {
                width: 100,
                title: 'Creditor Name',
                dataIndex: 'creditor_username',
            },
            {
                width: 100,
                title: 'Debtor Name',
                dataIndex: 'debtor_username'
            },
            {
                title: 'Record Name',
                dataIndex: 'name',
            },
            {
                title: 'Record Description',
                dataIndex: 'desc',
            },
            {
                width: 100,
                title: 'Status',
                //dataIndex: 'status',
                render: (record) => {
                    const {status, _id} = record
                    return (
                        <span>
                            <Button 
                            type='primary' 
                            onClick={() => this.updateStatus(_id, status===1 ? 2 : 1)}
                            >
                                {status===1 ? 'Complete it' : 'Change to Processing'}
                            </Button>
                            <p style={{fontWeight:'bold', 
                                       fontSize:'16px', 
                                       margin:'20px 0px'}}>
                                {status===1 ? 'Status: Processing' : 'Status: Completed'}
                            </p>
                        </span>
                    )
                }
            },
            {
                width: 100,
                title: '操作',
                render: (record) => {
                    return (
                        <span>
                            <LinkButton onClick={() => this.props.history.push('/record/detail', {record})}>Detail</LinkButton>
                            <LinkButton onClick={() => this.props.history.push('/record/addupdate', record)}>Fix</LinkButton>
                        </span>
                    )
                }
            }
        ]
    }
    getRecords = async (pageNum) => {
        this.setState({ loading: true })
        this.pageNum = pageNum
        const {searchName, searchType} = this.state
        let result
        if(searchName) {
            result = await reqSearchRecords(pageNum,
                                            PAGE_SIZE,
                                            searchName,
                                            searchType
            )
        } else { //normal
            result = await reqRecords(pageNum, PAGE_SIZE)
        }
        this.setState({ loading: false})
        if (result.status === 0) {
            // get data; update state; show list
            const { total, list } = result.data
            this.setState({
                total,
                records: list
            })
    }
}
    updateStatus = async (recordId, status) => {
       const result = await reqUpdateStatus(recordId, status)
       if (result.status===0) {
           message.success('Update Status Successfully!')
           this.getRecords(this.pageNum)
       }
    }
    UNSAFE_componentWillMount() {
        this.initColumns()
    }
    componentDidMount() {
        this.getRecords(1)
    }
    render() {
        const { records, total, loading, searchName, searchType } = this.state
        const title = (
            <span>
            <Select
                value={searchType}
                style={{width: 150}}
                onChange={value => this.setState({searchType: value})}
            >
                <Option value="recordName">Search by Name</Option>
                <Option value="recordDesc">Search by Description</Option>
            </Select>
            <Input
                placeholder='keyword'
                style={{width: 150, margin: '0 15px'}}
                value={searchName}
                onChange={event => 
                    this.setState({searchName: event.target.value})
                }
            />
            <Button
                type='primary'
                onClick={ () => this.getRecords(1)}>Search</Button>
            </span>
        )
        const extra = (
            <Button
                type='primary'
                onClick={ () => 
                    this.props.history.push('/record/addupdate')
                }>
                    <PlusOutlined />
                    Add New Record
            </Button>
        )
        return (
            <Card title={title} extra={extra}>
                <Table
                bordered
                loading={loading}
                rowKey='_id'
                dataSource={records}
                columns={this.columns}
                pagination={{
                    total,
                    defaultPageSize: PAGE_SIZE,
                    showQuickJumper: true,
                    onChange: this.getRecords
                    //(pageNum) => {this.getProducts(pageNum)}
                }}
                ></Table>
            </Card>
        )
    }
}