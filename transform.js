const _ = require('lodash');


const flipOnce = shape => {
  const dimension = shape.length;
  const newShape = _.cloneDeep(shape);
  _.each(shape, (row, rowIdx) => _.each(row, (cell, colIdx) => newShape[dimension - 1 - rowIdx][dimension - 1 - colIdx] = cell));
  return newShape;
};

const flip = (shape, flips = 0) => {
  let flippedShape = shape;
  _.times(flips, () => flippedShape = flipOnce(flippedShape));
  return flippedShape;
}

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
  let rotatedShape = shape;
  _.times(rotations, () => rotatedShape = rotateOnce(rotatedShape));
  return rotatedShape;
};


module.exports = {
  flip,
  rotate,
};
