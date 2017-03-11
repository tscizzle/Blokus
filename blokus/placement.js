const _ = require('lodash');

const { flip,
        rotate } = require('./transform');


const getShapePositions = (shape, position) => {
  const shapePositions = [];
  _.each(shape, (row, rowIdx) => _.each(row, (cell, colIdx) => {
    if (cell === 'X') {
      shapePositions.push({row: position.row + rowIdx, col: position.col + colIdx});
    }
  }));
  return shapePositions;
};

const getPlacementPositions = (piece, flipped, rotations, position) => {
  const { shape } = piece;
  const flippedShape = flipped ? flip(shape) : shape;
  const flippedRotatedShape = rotate(flippedShape, rotations);
  const placementPositions = getShapePositions(flippedRotatedShape, position);
  return placementPositions;
};

const isOutOfBounds = (position, board) => {
  const { row, col } = position;
  const height = board.length;
  const width = board[0].length;
  return row < 0 || col < 0 || row >= height || col >= width;
};

const isTaken = (position, board) => !isOutOfBounds(position, board) && !_.isNull(board[position.row][position.col]);

const isAdjacentToSamePlayer = (position, board, player) => {
  const { row, col } = position;
  const adjacentPositions = [
    {row, col: col + 1},
    {row, col: col - 1},
    {row: row + 1, col},
    {row: row - 1, col},
  ];
  return _.some(adjacentPositions, pos => !isOutOfBounds(pos, board) && board[pos.row][pos.col] === player);
};

const isDiagonalFromSamePlayer = (position, board, player) => {
  const { row, col } = position;
  const diagonalPositions = [
    {row: row + 1, col: col + 1},
    {row: row + 1, col: col - 1},
    {row: row - 1, col: col + 1},
    {row: row - 1, col: col - 1},
  ];
  return _.some(diagonalPositions, pos => !isOutOfBounds(pos, board) && board[pos.row][pos.col] === player);
};

const isInCorner = (position, board) => {
  const { row, col } = position;
  const height = board.length;
  const width = board[0].length;
  const corners = [
    {row: 0, col: 0},
    {row: 0, col: width - 1},
    {row: height - 1, col: 0},
    {row: height - 1, col: width - 1},
  ];
  return !_.isUndefined(_.find(corners, position));
};

const validatePiece = piece => {
  if (!piece) return 'PieceDoesNotExist';
  if (piece.used) return 'PieceAlreadyUsed';
};

const validatePlacementPositions = (positions, board, player) => {
  const anyPositionsOutOfBounds = _.some(positions, pos => isOutOfBounds(pos, board));
  if (anyPositionsOutOfBounds) return 'OutOfBounds';

  const anyTakenPositions = _.some(positions, pos => isTaken(pos, board));
  if (anyTakenPositions) return 'Taken';

  const anyPositionsAdjacentToSamePlayer = _.some(positions, pos => isAdjacentToSamePlayer(pos, board, player));
  if (anyPositionsAdjacentToSamePlayer) return 'AdjacentToSamePlayer';

  const isFirstTurn = !_.some(board, row => _.some(row, cell => cell === player));
  if (!isFirstTurn) {
    const noPositionsDiagonalFromSamePlayer = !_.some(positions, pos => isDiagonalFromSamePlayer(pos, board, player));
    if (noPositionsDiagonalFromSamePlayer) return 'NotDiagonalFromSamePlayer';
  } else {
    const noPositionsInCorner = !_.some(positions, pos => isInCorner(pos, board));
    if (noPositionsInCorner) return 'NotInCorner';
  }
};

const getPlaceFunction = (pieces, board) => {
  const placeFunction = ({player, piece, flipped = false, rotations = 0, position, probe = false}) => {
    const matchingPiece = _.find(pieces, {id: piece, player});
    const pieceValidation = validatePiece(matchingPiece);
    if (_.isString(pieceValidation)) return {failure: true, message: pieceValidation};

    const placementPositions = getPlacementPositions(matchingPiece, flipped, rotations, position);
    const placementPositionsValidation = validatePlacementPositions(placementPositions, board, player);
    if (_.isString(placementPositionsValidation)) return {failure: true, message: placementPositionsValidation};

    if (!probe) {
      _.each(placementPositions, ({row, col}) => board[row][col] = player);
      matchingPiece.used = true;
    }
    return {success: true, positions: placementPositions};
  };
  return placeFunction;
};


module.exports = {
  getPlaceFunction,
};