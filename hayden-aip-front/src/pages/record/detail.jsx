import React, {Component} from 'react'
import LinkButton from '../../components/link-button'
import { BASE_IMG_URL, THEME_COLOR } from '../../utils/constants'
import { Card, List } from 'antd'
import { Icon } from '@ant-design/compatible'
const Item = List.Item
/*
RecordDetail
*/
export default class RecordDetail extends Component {
    state = {}
    render() {
        const { status,
                creditor_username,
                debtor_username,
                name,
                desc,
                imgs,
                detail
            } = this.props.location.state.record
        const title = (
            <span>
                <LinkButton>
                <Icon 
                type="arrow-left" 
                style={{color: THEME_COLOR, marginRight: 15, fontSize: 20}} 
                onClick={() => this.props.history.goBack()}
                ></Icon>
                </LinkButton>
                <span>Record Detail</span>
            </span>
        )
        return (
            <Card title={title} className="record-detail">
                <List>
                    <Item>
                        <span className="left">Status =></span>
                        <span className="word" style={{fontSize: '16px'}}>{status===1 ? 'Processing' : 'Completed'}</span>
                    </Item>
                    <Item>
                        <span className="left">Creditor:</span>
                        <span className="word">{creditor_username}</span>
                    </Item>
                    <Item>
                        <span className="left">Debtor:</span>
                        <span className="word">{debtor_username}</span>
                    </Item>
                    <Item>
                        <span className="left">Record Name:</span>
                        <span className="word">{name}</span>
                    </Item>
                    <Item>
                        <span className="left">Record Description:</span>
                        <span className="word">{desc}</span>
                    </Item>
                    <Item>
                        <span className="left">Pictures:</span>
                        <span className="img">
                            <img
                            className="record-img" 
                            src="https://images-na.ssl-images-amazon.com/images/I/81f1sNBXtOL._AC_SX679_.jpg" 
                            alt=""
                            ></img>
                            <img
                            className="record-img"  
                            src="https://images-na.ssl-images-amazon.com/images/I/71JF8H6rCxL._AC_SX679_.jpg" 
                            alt=""
                            ></img>
                            {/* {
                                imgs.map(img => (
                                    <img key={img} className="record-img" src={BASE_IMG_URL + img} alt="img" />
                                ) )
                            } */}
                        </span>
                    </Item>
                    <Item>
                        <span className="left">Record Detail:</span>
                        <span className="word" dangerouslySetInnerHTML={{__html:detail}}></span>
                    </Item>
                </List>
            </Card>
        )
    }
}