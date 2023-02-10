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
  }
}


export default boardHelper;