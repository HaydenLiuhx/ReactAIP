/*
a model can operate users' data
 */
// 1.import mongoose
const mongoose = require('mongoose')
const md5 = require('blueimp-md5')

// 2.Schema(descript document structure)
const userSchema = new mongoose.Schema({
  username: {type: String, required: true}, // Username
  password: {type: String, required: true}, // Password
  create_time: {type: Number, default: Date.now},
})

// 3. define Model()
const UserModel = mongoose.model('users', userSchema)

// initialize super user: admin/admin
UserModel.findOne({username: 'admin'}).then(user => {
  if(!user) {
    UserModel.create({username: 'admin', password: md5('admin')})
            .then(user => {
              console.log('user initialization -> Username: admin *** Password: admin')
            })
  }
})

//UserModel.db.dropCollection('users')

// 4. export Model
module.exports = UserModel