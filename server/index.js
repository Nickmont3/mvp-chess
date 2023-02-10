const express = require('express');
const path = require('path');
const db = require('../database/index.js');
const Promise = require('bluebird');
const helpers = require('../client/dist/helpers/legalMoveHelpers.js');



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
//Old code from when I was using get request for legal moves
// app.post('/legals', (req, res, next) => {
//   db.getSquareStatus(req.body.from)
//     .then(results => {
//       if (results[0].pieceColor === req.body.turn) {
//         helpers.getPieceMoves(results[0], (output) => {
//           res.json(output);
//         });
//       } else {
//         res.sendStatus(202);
//       }
//     });

// })

app.post('/move', (req, res, next) => {
  db.movePiece(req.body.from, req.body.to);
  res.sendStatus(202);
})

let port = 3000;

app.listen(port, function() {
  console.log(`listening on port ${port}`);
});
