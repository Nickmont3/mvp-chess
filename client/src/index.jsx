import React from 'react';
import ReactDom from 'react-dom';
import { Button } from 'react-bootstrap';
import $ from 'jquery';

const { useState } = React;

const App = () => {

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

  const move = () => {
    const settings = {
      "url": "/move",
      "method": "POST",
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


  var [board, updateBoard] = useState('hello world');

  return (
    <div>
      {/* Buttons for testing */}
      <div className='startButton'>
        <Button onClick={setup}>
          Start
        </Button>
      </div>
      <div className='moveButton'>
        <Button onClick={move}>
          Move
        </Button>
      </div>
      <div className='board'>
        {JSON.stringify(board)}
      </div>
    </div>
  );
}

ReactDom.render(<App />, document.getElementById('app'));