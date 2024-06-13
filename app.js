const express = require('express')
const cors = require('cors')

var booksRouter = require('./routes/books')

var app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use('/books', booksRouter)
app.use(express.static("/home/zuza/node_project/uploads", {fallthrough: false}))

module.exports = app
