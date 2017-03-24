'use strict';

var _ = require('lodash');

var _require = require('./transform'),
    flip = _require.flip,
    rotate = _require.rotate;

// Position is the top-left-most X.


var getShapePositions = function getShapePositions(shape, position) {
  var shapePositions = [];
  // const leftCol = null;
  _.each(shape, function (row, rowIdx) {
    return _.each(row, function (cell, colIdx) {
      if (cell === 'X') {
        // if (!leftCol) leftCol = position.col - colIdx;
        shapePositions.push({ row: position.row + rowIdx, col: position.col + colIdx });
      }
    });
  });
  return shapePositions;
};

var getPlacementPositions = function getPlacementPositions(piece, flipped, rotations, position) {
  var shape = piece.shape;

  var flippedShape = flipped ? flip(shape) : shape;
  var flippedRotatedShape = rotate(flippedShape, rotations);
  var placementPositions = getShapePositions(flippedRotatedShape, position);
  return placementPositions;
};

var isOutOfBounds = function isOutOfBounds(position, board) {
  var row = position.row,
      col = position.col;

  var height = board.length;
  var width = board[0].length;
  return row < 0 || col < 0 || row >= height || col >= width;
};

var isTaken = function isTaken(position, board) {
  return !isOutOfBounds(position, board) && !_.isNull(board[position.row][position.col]);
};

var isAdjacentToSamePlayer = function isAdjacentToSamePlayer(position, board, player) {
  var row = position.row,
      col = position.col;

  var adjacentPositions = [{ row: row, col: col + 1 }, { row: row, col: col - 1 }, { row: row + 1, col: col }, { row: row - 1, col: col }];
  return _.some(adjacentPositions, function (pos) {
    return !isOutOfBounds(pos, board) && board[pos.row][pos.col] === player;
  });
};

var isDiagonalFromSamePlayer = function isDiagonalFromSamePlayer(position, board, player) {
  var row = position.row,
      col = position.col;

  var diagonalPositions = [{ row: row + 1, col: col + 1 }, { row: row + 1, col: col - 1 }, { row: row - 1, col: col + 1 }, { row: row - 1, col: col - 1 }];
  return _.some(diagonalPositions, function (pos) {
    return !isOutOfBounds(pos, board) && board[pos.row][pos.col] === player;
  });
};

var isInCorner = function isInCorner(position, board) {
  var row = position.row,
      col = position.col;

  var height = board.length;
  var width = board[0].length;
  var corners = [{ row: 0, col: 0 }, { row: 0, col: width - 1 }, { row: height - 1, col: 0 }, { row: height - 1, col: width - 1 }];
  return !_.isUndefined(_.find(corners, position));
};

var validatePiece = function validatePiece(piece) {
  if (!piece) return 'PieceDoesNotExist';
  if (piece.used) return 'PieceAlreadyUsed';
};

var validatePlacementPositions = function validatePlacementPositions(positions, board, player) {
  var anyPositionsOutOfBounds = _.some(positions, function (pos) {
    return isOutOfBounds(pos, board);
  });
  if (anyPositionsOutOfBounds) return 'PositionOutOfBounds';

  var anyTakenPositions = _.some(positions, function (pos) {
    return isTaken(pos, board);
  });
  if (anyTakenPositions) return 'PositionTaken';

  var anyPositionsAdjacentToSamePlayer = _.some(positions, function (pos) {
    return isAdjacentToSamePlayer(pos, board, player);
  });
  if (anyPositionsAdjacentToSamePlayer) return 'PositionAdjacentToSamePlayer';

  var isFirstTurn = !_.some(board, function (row) {
    return _.some(row, function (cell) {
      return cell === player;
    });
  });
  if (!isFirstTurn) {
    var noPositionsDiagonalFromSamePlayer = !_.some(positions, function (pos) {
      return isDiagonalFromSamePlayer(pos, board, player);
    });
    if (noPositionsDiagonalFromSamePlayer) return 'PositionNotDiagonalFromSamePlayer';
  } else {
    var noPositionsInCorner = !_.some(positions, function (pos) {
      return isInCorner(pos, board);
    });
    if (noPositionsInCorner) return 'PositionNotInCorner';
  }
};

var getPlaceFunction = function getPlaceFunction(pieces, board) {
  var placeFunction = function placeFunction(_ref) {
    var player = _ref.player,
        piece = _ref.piece,
        _ref$flipped = _ref.flipped,
        flipped = _ref$flipped === undefined ? false : _ref$flipped,
        _ref$rotations = _ref.rotations,
        rotations = _ref$rotations === undefined ? 0 : _ref$rotations,
        position = _ref.position,
        _ref$probe = _ref.probe,
        probe = _ref$probe === undefined ? false : _ref$probe;

    var matchingPiece = _.find(pieces, { id: piece, player: player });
    var pieceValidation = validatePiece(matchingPiece);
    if (_.isString(pieceValidation)) {
      return { failure: true, message: pieceValidation };
    }

    var placementPositions = getPlacementPositions(matchingPiece, flipped, rotations, position);
    var placementPositionsValidation = validatePlacementPositions(placementPositions, board, player);
    if (_.isString(placementPositionsValidation)) {
      return { failure: true, message: placementPositionsValidation };
    }

    if (!probe) {
      _.each(placementPositions, function (_ref2) {
        var row = _ref2.row,
            col = _ref2.col;
        return board[row][col] = player;
      });
      matchingPiece.used = true;
    }
    return { success: true, positions: placementPositions };
  };
  return placeFunction;
};

module.exports = {
  getPlaceFunction: getPlaceFunction
};