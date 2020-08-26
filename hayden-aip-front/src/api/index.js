import ajax from './ajax'
//import jsonp from 'jsonp'
//import {message} from 'antd'
const BASE = '/api'

//1. user login
export const reqLogin = (username,password) => 
ajax(BASE + '/login', {username,password}, 'POST')