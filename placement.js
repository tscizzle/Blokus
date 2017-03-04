const _ = require('lodash');

const { flip,
        rotate } = require('./transform');


const getShapePositions = (shape, position) => {
  const shapePositions = _.reduce(shape, (shapePositionsSoFar, row, rowIdx) => {
    const rowShapePositions = _.reduce(row, (rowShapePositionsSoFar, cell, colIdx) => {
      if (cell === 'X') {
        rowShapePositionsSoFar.push({row: position.row + rowIdx, col: position.col + colIdx});
      }
      return rowShapePositionsSoFar;
    }, []);
    shapePositionsSoFar.push(...rowShapePositions);
    return shapePositionsSoFar;
  }, []);
  return shapePositions;
};

const getPlacementPositions = (piece, flips, rotations, position) => {
  const { shape } = piece;
  const flippedShape = flip(shape, flips);
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
  return _.includes(corners, position);
};

const validatePiece = piece => {
  if (!piece) throw 'PieceDoesNotExist';
  if (piece.used) throw 'PieceAlreadyUsed';
};

const validatePlacementPositions = positions => {
  const anyPositionsOutOfBounds = _.some(positions, pos => isOutOfBounds(pos, board));
  if (anyPositionsOutOfBounds) throw 'OutOfBounds';

  const anyTakenPositions = _.some(positions, pos => isTaken(pos, board));
  if (anyTakenPositions) throw 'Taken';

  const anyPositionsAdjacentToSamePlayer = _.some(positions, pos => isAdjacentToSamePlayer(pos, board, player));
  if (anyPositionsAdjacentToSamePlayer) throw 'AdjacentToSamePlayer';

  const isPlayersFirstMove = _.isUndefined(_.find(turns, {player}));
  if (!isPlayersFirstMove) {
    const noPositionsDiagonalFromSamePlayer = !_.some(positions, pos => isDiagonalFromSamePlayer(pos, board, player));
    if (noPositionsDiagonalFromSamePlayer) throw 'NotDiagonalFromSamePlayer';
  } else {
    const noPositionsInCorner = !_.some(positions, pos => isInCorner(pos, board));
    if (noPositionsInCorner) throw 'NotInCorner';
  }
};

const getPlaceFunction = (pieces, board, turns) => {
  const placeFunction = placement => {
    placement = _.cloneDeep(placement);
    const { player, piece, flips, rotations, position } = placement;

    const matchingPiece = _.find(pieces, {id: piece, player});
    validatePiece(matchingPiece);

    const placementPositions = getPlacementPositions(matchingPiece, flips, rotations, position);
    validatePlacementPositions(placementPositions);

    _.each(placementPositions, ({row, col}) => board[row][col] = player);
    turns.push(placement);
    matchingPiece.used = true;
    return true;
  };
  return placeFunction;
};


module.exports = {
  getPlaceFunction,
};
