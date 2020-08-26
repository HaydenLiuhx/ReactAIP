/*
Models that can manipulate role collection data
 */
// 1.import mongoose
const mongoose = require('mongoose')

// 2.Schema(Describe the document structure)
const roleSchema = new mongoose.Schema({
  name: {type: String, required: true}, // role's name
  auth_name: String, // authorizer
  auth_time: Number, // Authorization time
  create_time: {type: Number, default: Date.now}, // create time
  menus: Array // Array of all menu paths that have permission to operate
})

// 3. Define Model (corresponding to collection, can operate collection)
const RoleModel = mongoose.model('roles', roleSchema)

// 4. export Model
module.exports = RoleModel