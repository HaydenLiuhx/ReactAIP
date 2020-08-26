const express = require('express')
//const app = express()
//const jwt = require('jsonwebtoken')
const UserModel = require('./model/UserModel')
const RecordModel = require('./model/RecordModel')
const RequestModel = require('./model/RequestModel')
const RoleModel = require('./model/RoleModel')

const mongoose = require('mongoose')
const md5 = require('blueimp-md5')
//const SECRET = 'Hayden'
// get router object
const router = express.Router()

//1. get all users
router.get('/api/users', (req, res) => {

    UserModel.find()
        .then(users => {
            RoleModel.find().then(roles => {
                res.send({ status: 0, data: { users, roles } })
            })
        })
        .catch(error => {
            console.error('Get user list exception', error)
            res.send({ status: 1, msg: 'Get user list exception, Please try again' })
        })
})

//2. login in 
router.post('/api/login', async (req, res) => {
    //check user isavailable?
    try {
        const { username, password } = req.body
        console.log(req.body)
        console.log(req.query)
        /*
        Query the database users based on username and password, 
        if not, return a message indicating an error, 
        if yes, return a login success message (including user) 
        */
        UserModel.findOne({ username, password: md5(password) })
            .then(user => {
                if (user) { // success
                    // cookie(userid: user._id), send to browser
                    res.cookie('userid', user._id, { maxAge: 1000 * 60 * 60 * 24 })
                    if (user.role_id) {
                        RoleModel.findOne({ _id: user.role_id })
                            .then(role => {
                                user._doc.role = role
                                console.log('role user', user)
                                res.send({ status: 0, data: user })
                            })
                    } else {
                        user._doc.role = { menus: [] }
                        // return user data
                        res.send({ status: 0, data: user })
                    }

                } else {// fail
                    res.send({ status: 1, msg: 'Username or Password is Wrong!' })
                }
            })
    } catch { (error => {
        console.error('Login Exception', error)
        res.send({ status: 1, msg: 'Login Exception, Please Try Again' })
    })
}
})

function pageFilter(arr, pageNum, pageSize) {
    pageNum = pageNum * 1
    pageSize = pageSize * 1
    const total = arr.length
    const pages = Math.floor((total + pageSize - 1) / pageSize)
    const start = pageSize * (pageNum - 1)
    const end = start + pageSize <= total ? start + pageSize : total
    const list = []
    for (var i = start; i < end; i++) {
        list.push(arr[i])
    }

    return {
        pageNum,
        total,
        pages,
        pageSize,
        list
    }
}
require('./file-upload')(router)


module.exports = router