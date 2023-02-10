const Promise = require('bluebird');

const getSquareData = (board, squareCoor) => {
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
};

export default getSquareData;