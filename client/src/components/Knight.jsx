import React from 'react';

const Knight = (props) => {
  var coor = [(props.coor.charCodeAt(0)-97), (Number(props.coor[1]) - 1)];

  //Code to swap the coordinates for display depending on color playing
  const whiteCoors = [0, 1, 2, 3, 4, 5, 6, 7];
  const blackCoors = [7, 6, 5, 4, 3, 2, 1, 0];
  const swapCoor = (c, a1, a2) => {
    return a2[a1.indexOf(c)];
  }
  if (props.piece.slice(-1) === '0') {
    coor[1] = swapCoor(coor[1], blackCoors, whiteCoors);
  } else {
    coor[1] = swapCoor(coor[1], whiteCoors, blackCoors);
  }

  return (
    <div
    className={props.piece  + ' piece'}
    style={{
      position: 'absolute',
      left: coor[0] * 100 + 10 + 'px',
      top: coor[1] * 100 + 10 + 'px'
    }}
    >

    </div>
  )
}

export default Knight;