import React, {Component} from 'react'
import { withRouter } from 'react-router-dom'

/*
Footer路由
*/
class Footer extends Component {
    render() {
        return (
            <div style={{textAlign: 'center', color: '#ccc'}}>
                Copyright 2020 - Hayden's aip
            </div>
        )
    }
}
// this.props is empty, 
//unable to execute the history and location in props
export default withRouter(Footer)