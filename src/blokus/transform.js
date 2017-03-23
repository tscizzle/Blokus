const _ = require('lodash');


const flip = shape => {
  const width = shape[0].length;
  const flippedShape = _.cloneDeep(shape);
  _.each(shape, (row, rowIdx) => _.each(row, (cell, colIdx) => flippedShape[rowIdx][width - 1 - colIdx] = cell));
  return flippedShape;
};

const rotateOnce = shape => {
  /*
    Assumes shape is a square array of arrays
    If shape has ODD dimension:
      - shift coordinates so the origin is at the center
      - use the transformation {x: x0, y: y0} => {x: -y0, y: x0}
      - shift coordinates back
      - (the above steps reduce to a nice formula, as used below)
    If shape has EVEN dimension:
      - add a middle row and column
      - recursively call rotateOnce on the now odd-dimensioned shape
      - remove the middle row and column
   */
  const dimension = shape.length;
  const middleIdx = _.floor(dimension / 2);
  let newShape = _.cloneDeep(shape);
  if (shape.length % 2 === 1) {
    _.each(shape, (row, rowIdx) => _.each(row, (cell, colIdx) => newShape[-1*colIdx + 2*middleIdx][rowIdx] = cell));
  } else if (shape.length % 2 === 0) {
    newShape.splice(middleIdx, 0, _.range(dimension).fill(null));
    _.each(newShape, row => row.splice(middleIdx, 0, null));
    newShape = rotateOnce(newShape);
    newShape.splice(middleIdx, 1);
    _.each(newShape, row => row.splice(middleIdx, 1));
  }
  return newShape;
};

const rotate = (shape, rotations = 0) => {
  shape = padToSquare(shape);
  rotations = mod(rotations, 4);
  _.times(rotations, () => shape = rotateOnce(shape));
  shape = unpadFromSquare(shape);
  return shape;
};


const padToSquare = shape => {
  let height = shape.length;
  let width = shape[0].length;
  while (height > width) {
    _.each(shape, row => row.push('O'));
    width = shape[0].length;
  }
  while (width > height) {
    shape.push(_.range(width).fill('O'));
    height = shape.length;
  }
  return shape;
}

const unpadFromSquare = shape => {
  // remove rows of all O's
  shape = _.filter(shape, row => _.some(row, cell => cell === 'X'));
  // remove columns of all O's
  const width = shape[0].length;
  const columnsToRemove = _.filter(_.range(width), colIdx => _.every(shape, row => row[colIdx] === 'O'));
  shape = _.map(shape, row => _.reject(row, (cell, colIdx) => _.includes(columnsToRemove, colIdx)));
  return shape;
}


// for handling negative rotations, need a mod operation which handles negative n correctly
// http://stackoverflow.com/a/17323608/3391108
const mod = (n, k) => ((n % k) + k) % k;


module.exports = {
  flip,
  rotate,
};
