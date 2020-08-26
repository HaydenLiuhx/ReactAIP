/*
Models that can manipulate product collection data
 */
// 1.import mongoose
const mongoose = require('mongoose')

// 2.Schema(Describe the document structure)
const requestSchema = new mongoose.Schema({
  sponsor_id: {type: String, required: true}, // debtor -> user_id
  creditor_id: {type: String}, // creditor(Zhai Zhu) ->user_id
  imgs: {type: Array, default: []}, // json string of n*image file names
  desc: {type: String}, //describe how to finish this request
  create_time: {type: Number, default: Date.now}, // create time
  status: {type: Number, default: 1}, // status: 0.idle 1.processing 2.finish
  detail: {type: String} //wysiwyg editor, a little bit change...
})


// 3. Define Model
const RequestModel = mongoose.model('requests', requestSchema)

// 4. export Model
module.exports = RequestModel