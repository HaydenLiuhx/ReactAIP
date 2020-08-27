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
                const dayPictureUrl = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
                const weather = data.weather[0].main
                const temperature = parseInt(data.main.temp - 273.15)
                resolve({ dayPictureUrl, weather, temperature })
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
