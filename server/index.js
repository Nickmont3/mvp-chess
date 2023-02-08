const express = require('express');
const path = require('path');
const db = require('../database/index.js');
const Promise = require('bluebird');


let app = express();

app.use(express.static(path.join(__dirname, '../client/dist')));
app.use(express.json());

app.get('/startGame', (req, res, next) => {
  db.clearBoard();
  db.createBoard();
  res.sendStatus(202);
});

app.get('/board', (req, res, next) => {
  db.getBoard()
    .then(results => {
      res.json(results);
    })
    .catch(err => {
      res.sendStatus(404);
    })
});

app.get('/clearBoard', (req, res, next) => {
  db.clearBoard();
  res.sendStatus(202);
});

app.post('/move', (req, res, next) => {
  db.movePiece(req.body.from, req.body.to);
  res.sendStatus(202);
})

let port = 3000;

app.listen(port, function() {
  console.log(`listening on port ${port}`);
});
