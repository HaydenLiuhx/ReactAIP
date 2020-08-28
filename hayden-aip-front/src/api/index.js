import ajax from './ajax'
import jsonp from 'jsonp'
import { message } from 'antd'

const BASE = '/api'

//0. jsonp weather
export const reqWeather = (city) => {
    return new Promise((resolve, reject) => {
        const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=daf9a333298a022bba0539a6fdcbc2ca`
        jsonp(url, {}, (err, data) => {
            console.log('jsonp()', err, data)
            //success
            if (!err && data.cod === 200) {
                const weatherIcon = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
                const weather = data.weather[0].main
                const temperature = parseInt(data.main.temp - 273.15)
                resolve({ weatherIcon, weather, temperature })
            }
            else {
                //fail
                message.error('Error! Please Try Again')
            }
        })
    })
}

//1. user login
export const reqLogin = (username, password) =>
    ajax(BASE + '/login', { username, password }, 'POST')
//2. get all records
export const reqRecords = (pageNum, pageSize) => 
    ajax(BASE + '/manage/record/list' , {pageNum, pageSize}) 
//3. update record status
export const reqUpdateStatus = (recordId, status) => 
    ajax(BASE + '/manage/record/updateStatus', {recordId, status}, 'POST')
//4. search record
export const reqSearchRecords = (pageNum, pageSize, searchName, searchType) => 
    ajax(BASE + '/manage/record/search', { 
        pageNum, 
        pageSize, 
        [searchType]: searchName,
})
//5. delete picture
export const reqDeleteImg = (name) => 
ajax(BASE + '/manage/img/delete', {name}, 'POST')
//6. add or update record
export const reqAddOrUpdateRecord = (record) => 
ajax(BASE + '/manage/record/' + (record._id?'update': 'add'), 
                                record, 'POST')
//7. show all users
export const reqUsers = () => 
    ajax(BASE + '/users')
//8. delete the user
export const reqDeleteUser = (userId) => 
    ajax(BASE + '/manage/user/delete', {userId}, 'POST')
//9. add user or update user
export const reqAddOrUpdateUser = (user) => 
    ajax(BASE + '/manage/user/' + (user._id ? 'update' : 'add'), user, 'POST')
//10. add new role
export const reqAddRole = (roleName) => 
    ajax(BASE + '/manage/role/add' , {roleName}, 'POST')
//11. update role
export const reqUpdateRole = (role) => 
    ajax(BASE + '/manage/role/update' , role, 'POST')
//12. get all roles
export const reqRoles = () => 
    ajax(BASE + '/manage/role/list')