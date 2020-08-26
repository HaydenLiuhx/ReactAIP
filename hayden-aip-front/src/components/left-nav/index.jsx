import React, {Component} from 'react'
import { withRouter } from 'react-router-dom'

/*
Bar Charts路由
*/
class LeftNav extends Component {
    render() {
        return (
            <div>
                LeftNav Bar
            </div>
        )
    }
}
// this.props is empty, 
//unable to execute the history and location in props
export default withRouter(LeftNav)