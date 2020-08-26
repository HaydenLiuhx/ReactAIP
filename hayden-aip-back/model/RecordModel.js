/*
Models that can manipulate product collection data
 */
// 1.import mongoose
const mongoose = require('mongoose')

// 2.Schema(Describe the document structure)
const recordSchema = new mongoose.Schema({
  creditor_id: {type: String, required: true}, // creditor(Zhai Zhu) ->user_id
  debtor_id: {type: String, required: true}, // debtor -> user_id
  imgs: {type: Array, default: []}, // json string of n*image file names
  create_time: {type: Number, default: Date.now}, // create time
  status: {type: Number, default: 1}, // status: 1.processing 2.finish
  detail: {type: String} //wysiwyg editor
})


// 3. Define Model
const RecordModel = mongoose.model('records', recordSchema)

// 4. export Model
module.exports = RecordModel