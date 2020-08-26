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

//get all users
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