const express = require('express')
//const app = express()
//const jwt = require('jsonwebtoken')
const UserModel = require('./model/UserModel')


const RoleModel = require('./model/RoleModel')

const mongoose = require('mongoose')
const md5 = require('blueimp-md5')
//const SECRET = 'Hayden'
// 得到路由器对象
const router = express.Router()

//获取所有用户列表
router.get('/api/users', (req, res) => {
    
    UserModel.find()
        .then(users => {
            RoleModel.find().then(roles => {
                res.send({status: 0, data: {users, roles}})
            })
        })
        .catch(error => {
        console.error('获取用户列表异常', error)
        res.send({status: 1, msg: '获取用户列表异常, 请重新尝试'})
      })

    
})

//require('./file-upload')(router)


module.exports = router