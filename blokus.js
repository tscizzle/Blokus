const _ = require('lodash');


/*
 * Setup
 */

const playerStartingPositions = [
  {x: 0, y: 0},
  {x: 1, y: 0},
  {x: 1, y: 1},
  {x: 0, y: 1},
];

const processConfig = function(config) {
  let { height, width, players } = config;
  height = height || 20;
  width = width || 20;
  players = [];
  players = _.map(_.range(4), playerID => {
    return {
      id: playerID,
      name: players[playerID] || `Player ${playerID}`,
      startingPosition: {
        x: playerStartingPositions[playerID].x * (width - 1),
        y: playerStartingPositions[playerID].y * (height - 1),
      },
    };
  });
  return {height, width, players};
};

const generatePieces = function() {
  const pieces = _.reduce(_.range(4), (piecesSoFar, playerID) => {
    const playerPieces = [{
      numSquares: 1,
      shape: [[1]],
    }, {
      numSquares: 2,
      shape: [[1, 0], [1, 0]],
    }, {
      numSquares: 3,
      shape: [[1, 0, 0], [1, 0, 0], [1, 0, 0]],
    }, {
      numSquares: 3,
      shape: [[1, 0], [1, 1]],
    }];
    _.each(playerPieces, (piece, pieceID) => {
      piece.id = pieceID;
      piece.player = playerID;
      piece.used = false;
    });
    piecesSoFar.push(...playerPieces);
    return piecesSoFar;
  }, []);
  return pieces;
};

const generateBoard = function(height, width) {
  return _.map(_.range(height), rowIdx => _.map(_.range(width), colIdx => null));
};


/*
 * Read-only methods
 */

const availablePieces = function(playerID) {
  return _.filter(this.pieces(), {player: playerID, 'used': false});
};

const look = function() {
  const lookCell = cell => !_.isNull(cell) ? cell : '-';
  const lookRow = row => _.map(row, lookCell).join(' ');
  const boardString = '[ ' + _.map(this.board(), lookRow).join(' ]\n[ ') + ' ]';
  console.log(boardString);
};


/*
 * Blokus API
 */

const Blokus = function(config = {}) {
  const { height, width, players } = processConfig(config);
  const pieces = generatePieces();
  const board = generateBoard(height, width);

  const place = function(placement) {
    const { player, piece, rotation, position } = placement;
    const matchingPiece = _.find(pieces, {id: piece, player});
    if (!matchingPiece) {
      throw 'PieceDoesNotExist';
    } else if (matchingPiece.used) {
      throw 'PieceAlreadyUsed';
    } else if (/* TODO: check if piece is off the board or conflicts with other pieces */false) {
      throw 'InvalidPlacement';
    } else {
      // TODO: mark the cells of the board
      matchingPiece.used = true;
    }
  };

  return {
    players: () => _.cloneDeep(players),
    pieces: () => _.cloneDeep(pieces),
    board: () => _.cloneDeep(board),
    availablePieces,
    place,
    look,
  };
};

module.exports = Blokus;
