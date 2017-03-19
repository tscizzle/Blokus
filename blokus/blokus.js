const _ = require('lodash');

const { processOptions,
        generatePieces,
        generateBoard    } = require('./initialize');
const { getPlaceFunction } = require('./placement');


const Blokus = (options = {}) => {
  const { height, width, players } = processOptions(options);

  /*
   * Internal objects
   */

  const pieces = generatePieces();
  const board = generateBoard(height, width);

  /*
   * Methods
   */

  const place = getPlaceFunction(pieces, board);

  const availablePieces = function({player, numCells}) {
    const pieceFilter = {player, 'used': false};
    if (_.isNumber(numCells)) {
      pieceFilter.numCells = numCells;
    }
    return _.filter(this.pieces(), pieceFilter);
  };

  const setPlayerPassed = function({player}) {
    const playerThatPassed = _.find(players, {id: player});
    playerThatPassed.hasPassed = true;
  };

  /*
   * Blokus API
   */

  return {
    players: () => _.cloneDeep(players),
    pieces: () => _.cloneDeep(pieces),
    board: () => _.cloneDeep(board),
    place,
    availablePieces,
    setPlayerPassed,
  };
};


module.exports = Blokus;
