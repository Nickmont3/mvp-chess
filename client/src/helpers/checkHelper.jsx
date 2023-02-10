import boardHelpers from './boardHelper.jsx';
import getLegalMoves from './legalMoveHelper.jsx';

var getPieces = boardHelpers.getOtherPieces;
var getSquareData = boardHelpers.getSquareDataSync;
var isKingInCheck = async (color, board, cb) => {
  const otherPieces = getPieces(board, color);
  var inCheck = false;
  var promises = otherPieces.map((piece) => {
    return new Promise((resolve) => {
      getLegalMoves(piece, board, (legalMoves) => {
        for (var move of legalMoves) {
          var landing = getSquareData(board, move);
          if (landing[0].pieceColor !== color && landing[0].piece === 'K') {
            inCheck = true;
          }
        }
        resolve();
      })
    });
  });
  const moves = await Promise.all(promises);
  cb(inCheck);

};

export default isKingInCheck;
