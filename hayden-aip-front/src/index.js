/*
    Entrance
    ReactDOM.render(）的作用是将<App/>的内容渲染到根“root”中去。
*/
import React from 'react'
import ReactDOM from 'react-dom'
import 'antd/dist/antd.css'
import App from './App'
import storageUtils from './utils/storageUtils';
import memoryUtils from './utils/memoryUtils';
//Read user in localstorage and save to memory
const user = storageUtils.getUser()
memoryUtils.user = user

//Render the App component label to the div of the index page
ReactDOM.render(<App/>, document.getElementById('root'))