const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/chessWithFriends');


//========= BOARD ==============

let boardSchema = mongoose.Schema({
  coor: String, //ie d4, e5, c1
  color: Number, //0 black 1 white
  piece: String, //none if empty
  pieceColor: Number, //-1 if empty 0 black 1 white
  hasMoved: Boolean
});

let Board = mongoose.model('Board', boardSchema);

const filesList = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

//Create new board with starting position in board table
module.exports.createBoard = () => {
  var count = 0;
  var [coor, color, piece, pieceColor] = ['', 0, '', 0];
  for (var rank = 1; rank <= 8; rank++) {
    for (file of filesList) {
      //All major pieces
      if (rank === 1 || rank === 8) {
        pieceColor = rank % 2;
        //Rooks
        if (file === 'a' || file === 'h') {
          piece = 'R';
        //Knights
        } else if (file === 'b' || file === 'g') {
          piece = 'N';
        //Bishops
        } else if (file === 'c' || file === 'f') {
          piece = 'B';
        //Queen
        } else if (file === 'd') {
          piece = 'Q';
        //King
        } else if (file === 'e') {
          piece = 'K';
        }
      //Pawns
      } else if (rank === 2 || rank === 7) {
        pieceColor = (rank + 1) % 2;
        piece = 'p'
      //Empty Squares
      } else {
        piece = 'none';
        pieceColor = -1;
      }
      coor = file + rank;
      color = count % 2;
      count++;

      /*Now that all variables have been set, create entry in Board that consists of one square */
      Board.create({coor, color, piece, pieceColor, hasMoved: false});
    }
  }
}

module.exports.getBoard = () => {
  return Board.find({}).exec();
}

module.exports.clearBoard = () => {
  Board.deleteMany({})
    .then((results) => {
      console.log(results);
    })
    .catch((err) => {
      console.log(err);
    });
}

module.exports.movePiece = (from, to) => {
  console.log(from, to);
  let fromData = Board.find({"coor": from}).exec();
  fromData
    .then(results => {
      if (!results || !results[0]) {
        throw results;
      }
      var castleKing = false;
      var castleQueen = false;
      if (results[0].piece === 'K' && (from[0] === 'e' && to[0] === 'g')) {
        castleKing = true;
      }
      var fromPiece = JSON.stringify(results[0].piece);
      var fromColor = JSON.stringify(results[0].pieceColor);
      Board.updateOne({"coor": from}, {"piece": "none", "pieceColor": -1, "hasMoved": false}).exec().then(results => {
        console.log("moved piece", results);
      });
      Board.updateOne({"coor": to}, {"piece": JSON.parse(fromPiece), "pieceColor": JSON.parse(fromColor), "hasMoved": true}).exec().then(results => {
        console.log("moved piece", results);
      });
      if (castleKing) {
        //Move rook over two squares to left
        Board.updateOne({"coor": 'h' + from[1]}, {"piece": "none", "pieceColor": -1, "hasMoved": false}).exec().then(results => {
          console.log("moved rook", results);
        });
        Board.updateOne({"coor": 'f' + from[1]}, {"piece": "R", "pieceColor": JSON.parse(fromColor), "hasMoved": true}).exec().then(results => {
          console.log("moved piece", results);
        });
      }
    })
    .catch(err => {
      console.log('oops illegal move');
    });
}


module.exports.getSquareStatus = (coor) => {
  return Board.find({"coor": coor}).exec();
}
