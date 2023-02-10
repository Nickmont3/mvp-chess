const Promise = require('bluebird');

const boardHelper = {
  getSquareData: (board, squareCoor) => {
    return new Promise((resolve, reject) => {
      var output = board.filter((square) => {
        return (square.coor === squareCoor);
      });
      if (output.length) {
        resolve(output);
      } else {
        resolve([]);
      }
    });
  },
  getSquareDataSync: (board, squareCoor) => {
    var output = board.filter((square) => {
      return (square.coor === squareCoor);
    });
    return output;
  },
  getOtherPieces: (board, color) => {
    return board.filter((square) => {
      return (square.pieceColor === color);
    });
  },
  //Makes a move on a boardCopy before sending it to the database to be moved
  //Used for check checking and also eventually ai
  movePiece: (bc, from, to) => {
    var board = JSON.parse(bc);
    const fromData = JSON.stringify(boardHelper.getSquareDataSync(board, from)[0]);
    const toData = boardHelper.getSquareDataSync(board, to)[0];
    return board.map((square) => {
      if (square.coor === from) {
        square.piece = "none";
        square.pieceColor = -1;
        return square;
      } else if (square.coor === to) {
        square.piece = JSON.parse(fromData).piece;
        square.pieceColor = JSON.parse(fromData).pieceColor;
        return square;
      } else {
        return square;
      }
    });
  }
}


export default boardHelper;