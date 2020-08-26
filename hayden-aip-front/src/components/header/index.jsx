import React, {Component} from 'react'
import { withRouter } from 'react-router-dom'

/*
Header路由
*/
class Header extends Component {
    render() {
        return (
            <div>
                Header
            </div>
        )
    }
}
// this.props is empty, 
//unable to execute the history and location in props
export default withRouter(Header)