'use strict';

var _ = require('lodash');

var flip = function flip(shape) {
  var width = shape[0].length;
  var flippedShape = _.cloneDeep(shape);
  _.each(shape, function (row, rowIdx) {
    return _.each(row, function (cell, colIdx) {
      return flippedShape[rowIdx][width - 1 - colIdx] = cell;
    });
  });
  return flippedShape;
};

var rotateOnce = function rotateOnce(shape) {
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
  var dimension = shape.length;
  var middleIdx = _.floor(dimension / 2);
  var newShape = _.cloneDeep(shape);
  if (shape.length % 2 === 1) {
    _.each(shape, function (row, rowIdx) {
      return _.each(row, function (cell, colIdx) {
        return newShape[-1 * colIdx + 2 * middleIdx][rowIdx] = cell;
      });
    });
  } else if (shape.length % 2 === 0) {
    newShape.splice(middleIdx, 0, _.range(dimension).fill(null));
    _.each(newShape, function (row) {
      return row.splice(middleIdx, 0, null);
    });
    newShape = rotateOnce(newShape);
    newShape.splice(middleIdx, 1);
    _.each(newShape, function (row) {
      return row.splice(middleIdx, 1);
    });
  }
  return newShape;
};

var rotate = function rotate(shape) {
  var rotations = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

  shape = padToSquare(shape);
  rotations = mod(rotations, 4);
  _.times(rotations, function () {
    return shape = rotateOnce(shape);
  });
  shape = unpadFromSquare(shape);
  return shape;
};

var padToSquare = function padToSquare(shape) {
  var height = shape.length;
  var width = shape[0].length;
  while (height > width) {
    _.each(shape, function (row) {
      return row.push('O');
    });
    width = shape[0].length;
  }
  while (width > height) {
    shape.push(_.range(width).fill('O'));
    height = shape.length;
  }
  return shape;
};

var unpadFromSquare = function unpadFromSquare(shape) {
  // remove rows of all O's
  shape = _.filter(shape, function (row) {
    return _.some(row, function (cell) {
      return cell === 'X';
    });
  });
  // remove columns of all O's
  var width = shape[0].length;
  var columnsToRemove = _.filter(_.range(width), function (colIdx) {
    return _.every(shape, function (row) {
      return row[colIdx] === 'O';
    });
  });
  shape = _.map(shape, function (row) {
    return _.reject(row, function (cell, colIdx) {
      return _.includes(columnsToRemove, colIdx);
    });
  });
  return shape;
};

// for handling negative rotations, need a mod operation which handles negative n correctly
// http://stackoverflow.com/a/17323608/3391108
var mod = function mod(n, k) {
  return (n % k + k) % k;
};

module.exports = {
  flip: flip,
  rotate: rotate
};