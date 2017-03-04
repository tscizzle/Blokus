const _ = require('lodash');

const { pieceCollection } = require('./pieces');


const processOptions = options => {
  let { height, width, players } = options;
  height = height || 20;
  width = width || 20;
  players = players || [];
  const playerStartingPositions = [
    {row: 0, col: 0},
    {row: 1, col: 0},
    {row: 1, col: 1},
    {row: 0, col: 1},
  ];
  players = _.map(_.range(4), playerID => {
    return {
      id: playerID,
      name: players[playerID] || `Player ${playerID}`,
      startingPosition: {
        row: playerStartingPositions[playerID].row * (height - 1),
        col: playerStartingPositions[playerID].col * (width - 1),
      },
    };
  });
  return {height, width, players};
};

const generatePieces = () => {
  const pieces = _.reduce(_.range(4), (piecesSoFar, playerID) => {
    const playerPieces = pieceCollection();
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

const generateBoard = (height, width) => _.map(_.range(height), rowIdx => _.map(_.range(width), colIdx => null));


module.exports = {
  processOptions,
  generatePieces,
  generateBoard,
};
