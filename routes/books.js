const express = require('express')
const router = express.Router()
const sqlite3 = require('sqlite3').verbose()
const multer = require('multer')
const path = require('path')
const fs = require('fs')

const db = new sqlite3.Database('node_project.db')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

const upload = multer({ storage: storage });

router.get('/', (req, res) => {
  const sql = "select * from book"
  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(400).json({"error":err.message})
      return
    }
    res.json(rows.map(row => ({
      id: row.ID,
      title: row.title,
      author: row.author,
      pages: row.pages,
      year: row.year,
      genre: row.genre
    })))
  })
})

router.post('/', upload.single('file'), (req, res) => {
  const sql = 'insert into book (title, author, pages, year, genre) values (?, ?, ?, ?, ?)'
  console.log(req.file)
  console.log(req.body)
  const { title, author, pages, year, genre } = req.body
  const params = [title, author, pages, year, genre]
  db.run(sql, params, function (err, result) {  // do NOT change to arrow function
    console.log(err)
    console.log(result)
    fs.rename(req.file.path, `./uploads/${this.lastID}`, console.log)
    res.status(201).json({
      id: this.lastID, title, author, pages, year, genre
    })
  })
})

router.put('/:id', upload.single('file'), (req, res) => {
  const sql = 'update book set title = ?, author = ?, pages = ?, year = ?, genre = ? WHERE ID = ?'
  const { title, author, pages, year, genre } = req.body
  const params = [title, author, pages, year, genre, req.params.id]
  db.run(sql, params, (err, result) => {
    console.log(err)
    console.log(result)
    console.log(req.file)
    if (req.file) {
      fs.rename(req.file.path, `./uploads/${req.params.id}`, console.log)
    } else if (req.body.removeFile) {
      fs.unlink(`./uploads/${req.params.id}`, console.log)
    }
    res.json({ id: req.params.id, title, author, pages, year, genre })
  })
})

router.delete('/:id', (req, res) => {
  const sql = 'delete from book where ID = ?'
  const params = [req.params.id]
  db.run(sql, params, (err, result) => {
    fs.unlink(`./uploads/${req.params.id}`, console.log)
    res.status(204).send()
  })
})

module.exports = router
