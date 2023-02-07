import React from 'react';
import ReactDom from 'react-dom';
import $ from 'jquery';

const { useState } = React;

const App = () => {

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

  var [board, updateBoard] = useState('hello world');

  getBoard((results) => {
    updateBoard(results);
  });

  return (
    <div>
      {board}
    </div>
  );
}

ReactDom.render(<App />, document.getElementById('app'));