var express = require('express');
var router = express.Router();

var sqlite3 = require('sqlite3').verbose()

let db = new sqlite3.Database('node_project.db');

router.get('/', (req, res) => {
  var sql = "select * from book"
  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(400).json({"error":err.message});
      return;
    }
    res.json({
      "message":"success",
      "data":rows
    })
  });
})

router.post('/', (req, res) => {
  const sql = 'insert into book (title, author, pages, year, genre) values (?, ?, ?, ?, ?)'
  const { title, author, pages, year, genre } = req.body
  const params = [title, author, pages, year, genre]
  db.run(sql, params, function (err, result) {  // do NOT change to arrow function
    console.log(err)
    console.log(result)
    res.status(201).json({
      ID: this.lastID, title, author, pages, year, genre
    })
  })
})

router.put('/:id', (req, res) => {
  const sql = 'update book set title = ?, author = ?, pages = ?, year = ?, genre = ? WHERE ID = ?'
  const { title, author, pages, year, genre } = req.body
  const params = [title, author, pages, year, genre, req.params.id]
  db.run(sql, params, (err, result) => {
    res.json({ ID: req.params.id, title, author, pages, year, genre })
  })
})

router.delete('/:id', (req, res) => {
  const sql = 'delete from book where ID = ?'
  const params = [req.params.id]
  db.run(sql, params, (err, result) => {
    res.status(204).send()
  })
})

module.exports = router;
