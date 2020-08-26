/*
Application startup module
1. Start the server via express
2. Connect to the database through mongoose
  Note: Only start the server after connecting to the database
3. Use middleware
 */
const mongoose = require('mongoose')
const express = require('express')
const app = express() // Generate application objects

// Declare the use of static middleware
app.use(express.static('public'))
// Declare to use middleware for parsing post requests
app.use(express.urlencoded({extended: true})) // The request body parameter is: name=tom&pwd=123
app.use(express.json()) // The request body parameter is json: {name: tom, pwd: 123}
// Declare the use of middleware that parses cookie data
const cookieParser = require('cookie-parser')
app.use(cookieParser())
// Declare the use of router middleware
const indexRouter = require('./index')
app.use('/', indexRouter)  //

const fs = require('fs')


mongoose.connect('mongodb://localhost:27017/hayden-aip', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(() => {
    console.log('Connect to db successfully!!!')
    // Only start after connect
    app.listen('6000', () => {
      console.log('Server start, Please visit -> http://localhost:6000')
    })
  })
  .catch(error => {
    console.error('fail to connect db', error)
  })
  mongoose.set('useFindAndModify', false);


// app.listen(4000,() => {
//     console.log('http://localhost:4000')
// })