import React from 'react';
import Pawn from './Pawn.jsx';
import Rook from './Rook.jsx';
import Queen from './Queen.jsx';
import King from './King.jsx';
import Bishop from './Bishop.jsx';
import Knight from './Knight.jsx';

const { useState } = React;

const Board = (props) => {

  let componentList = [];
  var piece;
  if (typeof props.board === 'object') {
    props.board.forEach((square) => {
      if (square.piece === 'R') {
        piece = 'rook' + square.pieceColor;
        componentList.push((<Rook piece={piece} coor={square.coor} key={JSON.stringify(square)}/>))
      } else if (square.piece === 'N') {
        piece = 'knight' + square.pieceColor;
        componentList.push((<Knight piece={piece} coor={square.coor} key={JSON.stringify(square)}/>))
      } else if (square.piece === 'B') {
        piece = 'bishop' + square.pieceColor;
        componentList.push((<Bishop piece={piece} coor={square.coor} key={JSON.stringify(square)}/>))
      } else if (square.piece === 'Q') {
        piece = 'queen' + square.pieceColor;
        componentList.push((<Queen piece={piece} coor={square.coor} key={JSON.stringify(square)}/>))
      } else if (square.piece === 'K') {
        piece = 'king' + square.pieceColor;
        componentList.push((<King piece={piece} coor={square.coor} key={JSON.stringify(square)}/>))
      } else if (square.piece === 'p') {
        piece = 'pawn' + square.pieceColor;
        componentList.push((<Pawn piece={piece} coor={square.coor} key={JSON.stringify(square)}/>))
      }
    })
  }
  return (
    <div className='board'>
      {componentList}
    </div>
  );

}

export default Board;