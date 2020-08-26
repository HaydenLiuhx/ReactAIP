/* 
Modules that can send asynchronous ajax requests
Package axios library
The return value is a promise
1. Optimization: unified handling of request exceptions
    Wrap a promise object created by yourself in the outer layer
    When there is an error in the request, instead of reject (error),
     an error message is displayed
2. Small optimization: get response.data asynchronously
*/
import axios from 'axios'
import { message } from 'antd'

export default function ajax(url, data = {}, type = 'GET') {
    return new Promise((resolve, reject) => {
        let promise
        //1.async ajax
        if (type === 'GET') {  //get
            promise = axios.get(url, {
                params: data
            })
        }
        else { //POST
            promise = axios.post(url, data)
        }
        //2.if success, call resolve(value)
        promise.then(response => {
            resolve(response.data)
            //3.if fail,not call reject(reason),massage the error
        }).catch(error => {
            message.error("Request error: " + error.message)
        })
    })


}