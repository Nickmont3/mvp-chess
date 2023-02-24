import React from 'react';
import ReactDom from 'react-dom';
import { Button } from 'react-bootstrap';
import $ from 'jquery';
import Board from './components/Board.jsx';
import legalMoveHelper from './helpers/legalMoveHelper.jsx';
import boardHelpers from './helpers/boardHelper.jsx';
import getCheck from './helpers/checkHelper.jsx';

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
        updateTurn(1);
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
  const getLegals = (from = null, keyboard = true) => {
    console.log('from', from);
    if (from === null) {
      from = prompt(turn ? "White's move\nPiece to move: " : "Black's move\nPiece to move: ");
    }
    return boardHelpers.getSquareData(board, from)
      .then(results => {
        console.log(results[0].pieceColor);
        if (results[0].pieceColor < 0) {
          throw ('no piece there')
        } else if (results[0].pieceColor !== turn ) {
          throw ('not your turn!');
        }
        const legalMoves = legalMoveHelper(results[0], board, (results) => {
          console.log(results);
          if (results.length) {
            if (keyboard) {
              move(from, results);
            } else {
              updateLegals(results);
              updateSel(from);
            }
          } else {
            throw ('cant move that.');
          }
        })
      })
      .catch(err => {
        console.log(err);
        if (keyboard) {
          getLegals();
        } else {
          updateLegals([]);
          updateSel('');
        }
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

  const move = (coor, legalMoves = legalMoves, keyboardIn = true) => {
    var boardCopy;
    var from;
    var to;
    if (keyboardIn) {
      to = prompt('Move to: ');
      from = coor;
      boardCopy = JSON.stringify(boardHelpers.movePiece(JSON.stringify(board), from, to));
    } else {
      to = coor;
      from = selectedCoor;
      boardCopy = JSON.stringify(boardHelpers.movePiece(JSON.stringify(board), from, to));
    }
    getCheck(Math.abs(turn-1), JSON.parse(boardCopy), (checkHuh) => {
      console.log(checkHuh, Math.abs(turn-1));
      if (checkHuh) {
        console.log('Dont let your king die!');
        if (keyboardIn) {
          getLegals();
        } else {
          updateLegals([]);
          updateSel('');
        }
      } else {
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
              var promotedPawn = boardHelpers.pawnToPromote(results, turn)
              if (promotedPawn) {
                const changeTo = prompt('What piece would you like to promote to?');
                results.map((square) => {
                  if (square.coor === promotedPawn) {
                    square.piece = changeTo;
                  }
                  return square;
                })
              }
              getCheck(turn, results, (checkHuh) => {
                console.log(checkHuh, turn);
                if (checkHuh) {
                  console.log('Check!');
                }
              })
              changeCheck(Math.abs(turn-1));
              turn ? updateTurn(0) : updateTurn(1);
              updateBoard(results);
              updateLegals([]);
              updateSel('');

            })
          });
        } else {
          console.log('illegal move!');
          if (keyboardIn) {
            getLegals();
          } else {
            updateLegals([]);
            updateSel('');
          }
        }
      }
    });


  }

  // const test = () => {
  //   console.log(boardHelpers.movePiece(board, 'd2', 'd4'));
  //   // const from = prompt('Move from: ');
  //   // const settings = {
  //   //   "url": "/test",
  //   //   "method": "POST",
  //   //   "timeout": 0,
  //   //   "headers": {
  //   //     "Content-Type": "application/json"
  //   //   },
  //   //   "data": JSON.stringify({
  //   //     "from": from
  //   //   })
  //   // }
  //   // $.ajax(settings);
  // }
  const clickBoard = (event) => {
    const x = Math.ceil(event.clientX/100)
    const y = Math.ceil(event.clientY/100)
    //Code to swap the coordinates for display depending on color playing
    const whiteCoors = [1, 2, 3, 4, 5, 6, 7, 8];
    const blackCoors = [8, 7, 6, 5, 4, 3, 2, 1];
    const swapCoor = (c, a1, a2) => {
      return a2[a1.indexOf(c)];
    }
    const coor = String.fromCharCode(x + 96) + swapCoor(y, whiteCoors, blackCoors);
    if (selectedCoor === '') {
      getLegals(coor, false);
    } else {
      move(coor, legalMoves, false);
    }
  }

  var [selectedCoor, updateSel] = useState('');
  var [legalMoves, updateLegals] = useState([]);
  var [check, changeCheck] = useState(-1);
  var [board, updateBoard] = useState('hello world');
  var [turn, updateTurn] = useState(1);

  React.useEffect(() => {
    getBoard(updateBoard);
  }, [board]);

  return (
    <div>
      <div onClick={clickBoard}>

        <Board board={board} />
      </div>
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
      </div>

      {JSON.stringify(board)} */}
    </div>
  );
}

ReactDom.render(<App />, document.getElementById('app'));