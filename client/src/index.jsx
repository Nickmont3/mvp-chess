import React from 'react';
import ReactDom from 'react-dom';
import { Button } from 'react-bootstrap';
import $ from 'jquery';
import Board from './components/Board.jsx';
import legalMoveHelper from './helpers/legalMoveHelper.jsx';
import getSquareData from './helpers/boardHelper.jsx';

const { useState } = React;

const App = () => {

  var turn = true;

  const setup = () => {
    const settings = {
      "url": "/startGame",
      "method": "GET",
      "timeout": 0,
      "headers": {
        "Content-Type": "application/json"
      }
    }

    $.ajax(settings).done(results => {
      getBoard((results) => {
        updateBoard(results)
      });
    })
  }

  const getBoard = (cb) => {
    const settings = {
      "url": "/board",
      "method": "GET",
      "timeout": 0,
      "headers": {
        "Content-Type": "application/json"
      }
    }

    $.ajax(settings).done(results => {
      cb(results);
    })
  }

  //Add async if using await
  const getLegals = () => {
    const from = prompt(turn ? "White's move\nPiece to move: " : "Black's move\nPiece to move: ");
    return getSquareData(board, from)
      .then(results => {
        console.log(results[0].pieceColor);
        if (results[0].pieceColor !== turn) {
          console.log('wrong turn');
          throw ('not your turn!');
        }
        const legalMoves = legalMoveHelper(results[0], board, (results) => {
          console.log(results);
          if (results.length) {
            move(results, from);
          } else {
            throw ('cant move that.');
          }
        })
      })
      .catch(err => {
        console.log(err);
        getLegals();
      });
    //This code was from when I was using get requests for legal moves but now only
    //use a post request on legal move.
    // const legalSettings = {
    //   "url": "/legals",
    //   "method": "POST",
    //   "timeout": 0,
    //   "headers": {
    //     "Content-Type": "application/json"
    //   },
    //   "data": JSON.stringify({
    //     "from": from,
    //     "turn": turn
    //   })
    // }

    // await $.ajax(legalSettings).done(legalMoves => {
    //   if (typeof legalMoves === "string") {
    //     console.log('Wrong turn!');
    //     getLegals();
    //   } else if (legalMoves) {
    //     move(legalMoves, from)
    //   } else {
    //     console.log('Cannot move that');
    //     getLegals();
    //   }
    // });
  }

  const move = (legalMoves, from) => {

    const to = prompt('Move to: ');
    if (legalMoves.includes(to)) {
      const moveSettings = {
        "url": "/move",
        "method": "POST",
        "timeout": 0,
        "headers": {
          "Content-Type": "application/json"
        },
        "data": JSON.stringify({
          "from": from,
          "to": to
        })
      }

      $.ajax(moveSettings).done(results => {
        getBoard((results) => {
          turn ? updateTurn(0) : updateTurn(1);
          updateBoard(results);
        });
      })
    } else {
      console.log('illegal move!');
      getLegals();
    }

  }

  // const test = () => {
  //   const from = prompt('Move from: ');
  //   const settings = {
  //     "url": "/test",
  //     "method": "POST",
  //     "timeout": 0,
  //     "headers": {
  //       "Content-Type": "application/json"
  //     },
  //     "data": JSON.stringify({
  //       "from": from
  //     })
  //   }
  //   $.ajax(settings);
  // }

  var [board, updateBoard] = useState('hello world');
  var [turn, updateTurn] = useState(1);

  return (
    <div>
      <Board board={board}/>
      {/* Buttons for testing */}
      <div className='startButton'>
        <Button onClick={setup}>
          Start
        </Button>
      </div>
      <div className='moveButton'>
        <Button onClick={getLegals}>
          Move
        </Button>
      </div>
      {/* <div className='testButton'>
        <Button onClick={test}>
          Test
        </Button>
      </div> */}

      {/* {JSON.stringify(board)} */}
    </div>
  );
}

ReactDom.render(<App />, document.getElementById('app'));