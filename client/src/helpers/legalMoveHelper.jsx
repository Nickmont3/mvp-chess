const Promise = require('bluebird');
import boardHelpers from './boardHelper.jsx';
import checkHelper from './checkHelper.jsx';

//================ Legal Moves ==================

const getPieceMoves = (piece, board, callback) => {
  let rank = Number(piece.coor[1]);
  let file = (piece.coor.charCodeAt(0) - 96);
  var output = [];

  var getSquareStatus = boardHelpers.getSquareData;
  // getSquareStatus(board, piece.coor).then(results => console.log('here is square status: ', results));

  //canCapture set to true for pieces besides pawn
  const addSquareIfEmpty = (square, canCapture = false, currentPiece) => {
    if (square) {
      if (square.piece === "none") {
        output.push(square.coor);
        return 1;
      } else if (canCapture) {
        if (square.piece) {
          if (square.pieceColor !== currentPiece.pieceColor) {
            output.push(square.coor);
            return 2;
          }
        }
      }
    }
    return 0;
  };
  const moveAndCheckCheck = (bc, from, to, color) => {
    const moveMade = boardHelpers.movePiece(bc, from, to);
    checkHelper(color, moveMade, (checkHuh) => {
      return checkHuh;
    })
  };

  const directionalMove = async (directions, callback) => {
    for (var direction of directions) {
      var pieceOrEdgeFound = false;
      var newRank = rank;
      var newFile = file;
      while (!pieceOrEdgeFound) {
        newRank += direction[1];
        newFile += direction[0];
        var coor = String.fromCharCode(newFile + 96) + newRank;
        const results = await getSquareStatus(board, coor);
        var result;
        if (results && results[0]) {
          result = results[0];
        } else {
          result = {piece: null};
        }
        const added = addSquareIfEmpty(result, true, piece);
        pieceOrEdgeFound = (added !== 1);
      }
    }
    callback(output);
  }

  if (piece.piece === 'p') {
    //Cant figure out how to make functionality for both colors at once so ill just separate them
    if (piece.pieceColor) {
      getSquareStatus(board, piece.coor[0] + (rank + 1))
        .then(results => {
          if (results && results[0]) {
            return results[0]
          } else{
            return {piece: null};
          }

        })
        .then(result => {
          const added = addSquareIfEmpty(result);
          //Pawn at starting pos, can move two squares if unblocked.
          if (rank === 2) {
            if (added) {
              return getSquareStatus(board, piece.coor[0] + (rank + 2));
            } else {
              throw getSquareStatus(board, String.fromCharCode((file + 1) + 96) + (rank + 1));
            }
          } else {
            throw getSquareStatus(board, String.fromCharCode((file + 1) + 96) + (rank + 1));
          }
        })
        .then(results => {
          addSquareIfEmpty(results[0]);
          throw getSquareStatus(board, String.fromCharCode((file + 1) + 96) + (rank + 1));
        })
        .catch(results => {
          return results;

        })
        .then(results => {
          if (results && results[0]) {
            return results[0];
          } else {
            return {piece: null};
          }
        })
        .then(result => {
          const upRight = result;
          if (upRight) {
            if (upRight.piece && upRight.piece !== "none") {
              if (upRight.pieceColor !== piece.pieceColor) {
                output.push(upRight.coor);
              }
            }
          }
          return getSquareStatus(board, String.fromCharCode((file - 1) + 96) + (rank + 1));
        })
        .then(results => {
          const upLeft = results[0];
          if (upLeft) {
            if (upLeft.piece && upLeft.piece !== "none") {
              if (upLeft.pieceColor !== piece.pieceColor) {
                output.push(upLeft.coor);
              }
            }
          }
          callback(output);
        });
    } else {
      getSquareStatus(board, piece.coor[0] + (rank - 1))
      .then(results => {
        if (results && results[0]){
          return results[0]
        } else {
          return {piece: null};
        }
      })
      .then(result => {
          const added = addSquareIfEmpty(result);
          //Pawn at starting pos, can move two squares if unblocked.
          if (rank === 7) {
            if (added) {
              return getSquareStatus(board, piece.coor[0] + (rank - 2));
            } else {
              throw getSquareStatus(board, String.fromCharCode((file + 1) + 96) + (rank - 1));
            }
          } else {
            throw getSquareStatus(board, String.fromCharCode((file + 1) + 96) + (rank - 1));
          }
        })
        .then(results => {
          addSquareIfEmpty(results[0]);
          throw getSquareStatus(board, String.fromCharCode((file + 1) + 96) + (rank - 1));
        })
        .catch(results => {
          return results;

        })
        .then(results => {
          if (results && results[0]) {
            return results[0];
          } else {
            return {piece: null};
          }
        })
        .then(result => {
          const upRight = result;
          if (upRight) {
            if (upRight.piece && upRight.piece !== "none") {
              if (upRight.pieceColor !== piece.pieceColor) {
                output.push(upRight.coor);
              }
            }
          }
          return getSquareStatus(board, String.fromCharCode((file - 1) + 96) + (rank - 1));
        })
        .then(results => {
          const upLeft = results[0];
          if (upLeft) {
            if (upLeft.piece && upLeft.piece !== "none") {
              if (upLeft.pieceColor !== piece.pieceColor) {
                output.push(upLeft.coor);
              }
            }
          }
          callback(output);
        });
    }
  } else if (piece.piece === 'K') {
    const moveList = [
      [1, 1],
      [1, 0],
      [1, -1],
      [0, 1],
      [0, -1],
      [-1, -1],
      [-1, 0],
      [-1, 1]
    ]
    var promises = [];
    var newRank;
    var newFile;
    for (var move of moveList) {
      newFile = file + move[0];
      newRank = rank + move[1];
      console.log('Kingtries: ', file, rank, newRank, newFile)
      var coor = String.fromCharCode(newFile + 96) + newRank;
      promises.push(
        getSquareStatus(board, coor)
          .then(results => {
            if (results && results[0]) {
              return results[0];
            } else {
              return {piece: null};
            }
          })
          .then(result => {
            var added = addSquareIfEmpty(result, true, piece);
            //Check if king can castle
            //*NOTE* currently allows castle through check which is an illegal move
            if (!piece.hasMoved && added === 1) {
              if (Number(result.coor[1]) === 8 || Number(result.coor[1]) === 1) {
                //Check for kingside castle
                const oneRight = boardHelpers.getSquareDataSync(board, 'g' + Number(result.coor[1]));
                const shouldBeRook = boardHelpers.getSquareDataSync(board, 'h' + Number(result.coor[1]));
                if (shouldBeRook[0].piece === 'R' && !shouldBeRook[0].hasMoved) {
                  addSquareIfEmpty(oneRight[0]);
                }

                //Check for queenside castle
                const oneLeft = boardHelpers.getSquareDataSync(board, 'd' + Number(result.coor[1]));
                const twoLeft = boardHelpers.getSquareDataSync(board, 'c' + Number(result.coor[1]));
                const threeLeft = boardHelpers.getSquareDataSync(board, 'b' + Number(result.coor[1]));
                const shouldBeRookQ = boardHelpers.getSquareDataSync(board, 'a' + Number(result.coor[1]));

                if (shouldBeRookQ[0].piece === 'R' && !shouldBeRookQ[0].hasMoved) {
                  if (oneLeft[0].piece === 'none' && threeLeft[0].piece === 'none') {
                    addSquareIfEmpty(twoLeft[0]);
                  }
                }


              }
            }
          })
      );
    }

    Promise.all(promises)
      .then(() => {
        callback(output);
      })
  } else if (piece.piece === 'Q') {
    const directionList = [
      [1, 1],
      [1, -1],
      [-1, -1],
      [-1, 1],
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1]
    ]
    directionalMove(directionList, callback);
  } else if (piece.piece === 'B') {
    const directionList = [
      [1, 1],
      [1, -1],
      [-1, -1],
      [-1, 1]
    ]
    directionalMove(directionList, callback);
  } else if (piece.piece === 'N') {
     const knightMoves = (x, y) => {
      const possibleMoves = [
        [x + 2, y + 1],
        [x + 2, y - 1],
        [x - 2, y + 1],
        [x - 2, y - 1],
        [x + 1, y + 2],
        [x + 1, y - 2],
        [x - 1, y + 2],
        [x - 1, y - 2]
      ];

      return possibleMoves.filter(([i, j]) => i >= 1 && i <= 8 && j >= 1 && j <= 8);
    }
    let moveList = knightMoves(file, rank);

    const promises = moveList.map((move) => {
      //First turn the move into a coor
      var coor = String.fromCharCode(move[0] + 96) + move[1];
      //Add movestatuspromise to promiselist
      return getSquareStatus(board, coor)
        .then(results => {
          if (results && results[0]) {
            return results[0];
          } else {
            return {piece: null};
          }
        })
        .then(result => {
          addSquareIfEmpty(result, true, piece);
        });
    });
    Promise.all(promises)
      .then(() => {
        callback(output);
      });

  } else if (piece.piece === 'R') {
    const directionList = [
      [1, 0],
      [-1, 0],
      [0, -1],
      [0, 1]
    ]
    directionalMove(directionList, callback);
  }
}

export default getPieceMoves;