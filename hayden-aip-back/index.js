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

//3. add new user
router.post('/api/manage/user/add', (req, res) => {
    const {username, password} = req.body
    UserModel.findOne({username})
      .then(user => {
        // if user exist
        if (user) {
          // return error
          res.send({status: 1, msg: 'This User is Existed'})
          return new Promise(() => {
          })
        } else { // Not exist
          // Save
          return UserModel.create({...req.body, password: md5(password || 'admin')})
        }
      })
      .then(user => {
        res.send({status: 0, data: user})
      })
      .catch(error => {
        console.error('Registering Exception', error)
        res.send({status: 1, msg: 'Adding New User Exception, Please Try it Again'})
      })
  })

  //4. update user
  router.post('/api/manage/user/update', (req, res) => {
    const user = req.body
    UserModel.findOneAndUpdate({_id: user._id}, user)
      .then(oldUser => {
        const data = Object.assign(oldUser, user)
        // return
        res.send({status: 0, data})
      })
      .catch(error => {
        console.error('Updating User Exception', error)
        res.send({status: 1, msg: 'Updating User Exception, Please Try Again!'})
      })
  })

  //5. delete user
router.post('/api/manage/user/delete', (req, res) => {
    const {userId} = req.body
    UserModel.deleteOne({_id: userId})
      .then((doc) => {
        res.send({status: 0})
      })
  })

  //6. add record
router.post('/api/manage/record/add', (req, res) => {
    const record = req.body
    RecordModel.create(record)
      .then(record => {
        res.send({status: 0, data: record})
      })
      .catch(error => {
        console.error('Adding Record Exception', error)
        res.send({status: 1, msg: 'Adding Record Exception, Please Try it Again!'})
      })
  })

  // 7. get record by page
router.get('/api/manage/record/list', (req, res) => {
    const {pageNum, pageSize} = req.query
    RecordModel.find({})
      .then(records => {
        res.send({status: 0, data: pageFilter(records, pageNum, pageSize)})
      })
      .catch(error => {
        console.error('Get Record List Exception', error)
        res.send({status: 1, msg: 'Get Record List Exception, Please Try it Again'})
      })
  })

  //8. search record list
router.get('/api/manage/record/search', (req, res) => {
    const {pageNum, pageSize, searchName, recordName, recordDesc} = req.query
    let contition = {}
    console.log(req.query)
    if (recordName) {
      contition = {name: new RegExp(`^.*${recordName}.*$`)}
    } else if (recordDesc) {
      contition = {desc: new RegExp(`^.*${recordDesc}.*$`)}
    }
    console.log(contition)
    RecordModel.find(contition)
      .then(records => {
        res.send({status: 0, data: pageFilter(records, pageNum, pageSize)})
      })
      .catch(error => {
        console.error('搜索商品列表异常', error)
        res.send({status: 1, msg: '搜索商品列表异常, 请重新尝试'})
      })
  })

  //9.update record
router.post('/api/manage/record/update', (req, res) => {
    const record = req.body
    RecordModel.findOneAndUpdate({_id: record._id}, record)
      .then(oldRecord => {
        res.send({status: 0})
      })
      .catch(error => {
        console.error('Update Record Exception', error)
        res.send({status: 1, msg: 'Update Record Exception, Please Try Again'})
      })
  })

  // Update record status (processing | finished)
router.post('/api/manage/record/updateStatus', (req, res) => {
    const {recordId, status} = req.body
    console.log(req.body)
    RecordModel.findOneAndUpdate({_id: recordId}, {status})
      .then(oldRecord => {
        res.send({status: 0})
      })
      .catch(error => {
        console.error('Update Record Status Exception', error)
        res.send({status: 1, msg: 'Update Record Status Exception, Please Try Again!'})
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