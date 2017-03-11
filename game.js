const _ = require('lodash');

const blokus = require('./blokus');


const Game = (options = {}) => {
  /*
   * Internal objects
   */

  const gameBlokus = blokus(options);

  /*
   * Methods
   */

  const currentPlayer = () => {
    const turns = gameBlokus.turns();
    return turns.length > 0 ? (turns[turns.length - 1].player + 1) % 4 : 0;
  };

  const availablePieces = ({player, numCells}) => {
    const pieceFilter = {player, 'used': false};
    if (_.isNumber(numCells)) {
      pieceFilter.numCells = numCells;
    }
    return _.filter(gameBlokus.pieces(), pieceFilter);
  };

  /*
   * Game API
   */

  return {
    blokus: gameBlokus,
    currentPlayer,
    availablePieces,
    place,
  };
};


module.exports = Game;
